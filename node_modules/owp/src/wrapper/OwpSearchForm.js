import { Button, withStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import Formsy from 'formsy-react';
import {
    assignIn,
    debounce,
    get,
    isBoolean,
    isEmpty,
    isNil,
    mapValues,
    range,
    throttle,
} from 'lodash';
import FuseAnimate from 'owp/@fuse/components/FuseAnimate/FuseAnimate';
import { query, queryAll } from 'owp/api';
import { getAccessToken } from 'owp/auth';
import { deepKeysByObject } from 'owp/common';
import store from 'owp/store';
import { resetAutoComplate } from 'owp/store/actions/owp';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';

const GET_ALL_DATA_VALUE = '@@@@@@';
const ACCESS_TOKEN = getAccessToken();

const styles = (theme) => ({
    root: {},
    button: {
        margin: theme.spacing.unit,
        whiteSpace: 'noWrap',
        backgroundColor: '#354359',
        color: 'white',
        '&:hover': {
            backgroundColor: '#495669',
            color: 'white',
        },
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 16,
    },
});

function OwpSearchForm({
    className,
    classes,
    url,
    urls,
    children,
    isReady,
    showSearchButton,
    showResetButton,
    autoSubmit,
    onBeforeSubmit,
    onSubmit,
    onReset,
    onMount,
    onError,
    onSearchClick,
    afterMapping,
}) {
    const [formsyRef, searchButtonRef, resetButtonRef] = range(3).map(() => useRef(null));

    const _debounce = useCallback(
        debounce((func = () => {}) => func(), 1000),
        []
    );
    const _throttle = useCallback(
        throttle((func = () => {}) => func(), 300),
        []
    );
    const _dispatch = useCallback(
        throttle((action) => {
            store.dispatch(action);
        }, 1000),
        []
    );

    useEffect(() => {
        let isUnmount = false;

        if (autoSubmit) {
            _debounce(() => !isUnmount && handleSubmit());
        }

        onMount({
            refs: {
                formsy: get(formsyRef, 'current'),
                ...(showSearchButton && { searchButton: get(searchButtonRef, 'current') }),
                ...(showResetButton && { resetButton: get(resetButtonRef, 'current') }),
            },
        });

        return () => {
            isUnmount = true;
        };
    }, []);

    const handleSubmit = async (values = {}) => {
        try {
            let currentValuesOfFlattenerKeys =
                formsyRef.current.getCurrentValues instanceof Function
                    ? mapValues(formsyRef.current.getCurrentValues(), (value) =>
                          isNil(value) ? '' : value === GET_ALL_DATA_VALUE ? '' : value
                      )
                    : {};

            if (isEmpty(currentValuesOfFlattenerKeys)) {
                const model = isEmpty(values) ? formsyRef.current.getModel() : values;
                assignIn(
                    currentValuesOfFlattenerKeys,
                    Object.fromEntries(
                        get(formsyRef.current, 'prevInputNames', deepKeysByObject(model)).map(
                            (key) => {
                                const value = get(model, key, '');
                                return [key, value === GET_ALL_DATA_VALUE ? '' : value];
                            }
                        )
                    )
                );
            }

            if (afterMapping instanceof Function) {
                const afterMappingValuesOfFlattenerKeys = afterMapping(
                    currentValuesOfFlattenerKeys
                );

                if (!isEmpty(afterMappingValuesOfFlattenerKeys)) {
                    currentValuesOfFlattenerKeys = afterMappingValuesOfFlattenerKeys;
                }
            }

            if (onBeforeSubmit instanceof Function) {
                const resultBeforeSubmitData = onBeforeSubmit(currentValuesOfFlattenerKeys);
                if (
                    !isNil(resultBeforeSubmitData) &&
                    isBoolean(resultBeforeSubmitData) &&
                    !resultBeforeSubmitData
                ) {
                    return;
                }
            }

            if (isEmpty(url) && isEmpty(urls)) {
                onSubmit([], currentValuesOfFlattenerKeys);
                return;
            }

            const params = {
                jsondata: JSON.stringify({
                    ...currentValuesOfFlattenerKeys,
                    VER: '2',
                }),
                TOKEN: ACCESS_TOKEN,
            };

            const data =
                (await (!!url
                    ? query({
                          url,
                          params,
                      })
                    : queryAll(
                          urls.map((url) => ({
                              url,
                              params,
                          }))
                      ))) || [];

            onSubmit(data, currentValuesOfFlattenerKeys);
        } catch (error) {
            console.error(error);
            onError(error);
        }
    };

    const handleReset = () => {
        onReset();
        _dispatch(resetAutoComplate(true));
        _throttle(() => _dispatch(resetAutoComplate(false)));
    };

    return (
        <Formsy
            ref={formsyRef}
            // onReset={handleReset}
            onSubmit={handleSubmit}
            className={classNames('flex flex1 w-full items-center justify-between', className)}
        >
            <div className="flex items-start">{children}</div>
            <div className="flex items-end">
                {showSearchButton && (
                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            variant="outlined"
                            className={classes.button}
                            type="submit"
                            buttonRef={searchButtonRef}
                            disabled={!isReady}
                            onClick={onSearchClick}
                        >
                            <SearchIcon
                                className={classNames(classes.leftIcon, classes.iconSmall)}
                            />
                            검&nbsp;&nbsp;&nbsp;색
                        </Button>
                    </FuseAnimate>
                )}
                {showResetButton && (
                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                        <Button
                            variant="outlined"
                            className={classes.button}
                            // type="reset"
                            onClick={handleReset}
                            buttonRef={resetButtonRef}
                        >
                            <ClearAllIcon
                                className={classNames(classes.leftIcon, classes.iconSmall)}
                            />
                            초기화
                        </Button>
                    </FuseAnimate>
                )}
            </div>
        </Formsy>
    );
}

OwpSearchForm.propTypes = {
    className: PropTypes.string,
    isReady: PropTypes.bool,
    url: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.string),
    showSearchButton: PropTypes.bool,
    showResetButton: PropTypes.bool,
    autoSubmit: PropTypes.bool,
    onBeforeSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onMount: PropTypes.func,
    onError: PropTypes.func,
    onSearchClick: PropTypes.func,
    afterMapping: PropTypes.func,
};
OwpSearchForm.defaultProps = {
    className: '',
    url: '',
    urls: [],
    isReady: true,
    showSearchButton: true,
    showResetButton: true,
    autoSubmit: false,
    onSubmit: (data, model) => {},
    onReset: () => {},
    onMount: ({ ref }) => {},
    onError: () => {},
    onSearchClick: (event) => {},
};

export default withStyles(styles, { withTheme: true })(OwpSearchForm);

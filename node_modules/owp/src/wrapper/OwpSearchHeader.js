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
import { getAccessToken } from 'owp/auth';
import { deepKeysByObject, isJSON } from 'owp/common';
import { depr } from 'owp/debug';
import store from 'owp/store';
import { setNetworkStatus } from 'owp/store/actions';
import { resetAutoComplate } from 'owp/store/actions/owp';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import OwpMessage from './OwpMessage';

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

function OwpSearchHeader({
    className,
    classes,
    url,
    children,
    gridId,
    gridIndex,
    subUrl,
    subKeyName,
    subValName,
    autoSubmit,
    showResetButton,
    onBeforeSubmit,
    onSubmit,
    onReset,
    onDataGet,
    OnGetExportValue,
    onMount,
    onError,
    callfunc,
    callfunc2,
}) {
    const [formsyRef, searchButtonRef, resetButtonRef] = range(3).map(() => useRef(null));

    const _debounce = useCallback((fn = () => {}, delay = 300) => debounce(fn, delay)(), []);
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

        onMount({
            refs: {
                formsy: get(formsyRef, 'current'),
                searchButton: get(searchButtonRef, 'current'),
                ...(showResetButton && { resetButton: get(resetButtonRef, 'current') }),
            },
        });

        _debounce(() => {
            window.Grids.OnExpand = function (grid, row) {
                if (!!subUrl && !!subKeyName && !!subValName) {
                    grid.Def.DETAIL.DetailTreeGrid = `<bdo Data_Url="${process.env.REACT_APP_REST_API_URL}/${subUrl}?jsondata=%7B%22VER%22:%222%22,%22${subKeyName}%22:%22${row[subValName]}%22%7D" Page_Method="Get"></bdo>`;
                }
            };

            window.Grids.OnDataSend = function (grid, source, data, Func) {
                _dispatch(setNetworkStatus('START'));
            };

            window.Grids.OnDataReceive = function (grid, source) {
                _dispatch(setNetworkStatus('DONE'));
            };

            window.Grids.OnDataGet = (grid, source, data, io) => {
                if (onDataGet instanceof Function && isJSON(data)) {
                    try {
                        return JSON.stringify(onDataGet(JSON.parse(data)));
                    } catch (error) {
                        console.error(error);
                    }
                }
            };

            window.Grids.OnGetExportValue = (grid, row, col, value) => {
                if (OnGetExportValue instanceof Function && row.Kind === 'Data') {
                    return OnGetExportValue(col, value);
                }

                return value;
            };
        });

        if (autoSubmit) {
            _debounce(() => !isUnmount && handleSubmit(), 1000);
        }
        return () => {
            isUnmount = true;
            window.TGDelEvent();
        };
    }, []);

    const handleSubmit = (values = {}) => {
        try {
            const currentValuesOfFlattenerKeys =
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

            if (callfunc instanceof Function) {
                depr(
                    '[OwpSearchHeader]: `callfunc()` prop은 deprecate 되었습니다. `onBeforeSubmit(searchParams)` prop을 사용 바랍니다..'
                );

                callfunc();
            }

            if (!url) {
                console.error('`url` prop 을 확인해주세요!');
                return;
            }

            const gridInstance = !!gridId
                ? window.GetGrids().find(({ id }) => id === gridId)
                : get(window.GetGrids(), gridIndex);

            if (!!gridInstance) {
                gridInstance.Data.Data.Url = `${
                    process.env.REACT_APP_REST_API_URL
                }/${url}?jsondata=${encodeURI(
                    JSON.stringify({ ...currentValuesOfFlattenerKeys, VER: '2' })
                )}&TOKEN=${ACCESS_TOKEN}`;
                gridInstance.ReloadBody();

                if (onSubmit instanceof Function) {
                    onSubmit(currentValuesOfFlattenerKeys);
                }
                return;
            }

            OwpMessage({
                message: 'Grid 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
                variant: 'error',
            });
        } catch (error) {
            console.error(error);
            onError(error);
        }
    };

    const handleReset = throttle(() => {
        if (onReset instanceof Function) {
            onReset();
        }

        if (callfunc2 instanceof Function) {
            depr(
                '[OwpSearchHeader]: `callfunc2()` prop은 deprecate 되었습니다. `onReset()` prop을 사용 바랍니다..'
            );

            callfunc2();
        }

        _dispatch(resetAutoComplate(true));
        _throttle(() => _dispatch(resetAutoComplate(false)));
    }, 1000);

    return (
        <Formsy
            ref={formsyRef}
            // onReset={handleReset}
            onSubmit={handleSubmit}
            className={classNames('flex flex1 w-full items-center justify-between', className)}
        >
            <div className="flex items-start">{children}</div>
            <div className="flex items-end">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Button
                        variant="outlined"
                        className={classes.button}
                        type="submit"
                        buttonRef={searchButtonRef}
                    >
                        <SearchIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                        검&nbsp;&nbsp;&nbsp;색
                    </Button>
                </FuseAnimate>
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

OwpSearchHeader.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string,
    gridId: PropTypes.string,
    gridIndex: PropTypes.number,
    subUrl: PropTypes.string,
    subKeyName: PropTypes.string,
    subValName: PropTypes.string,
    autoSubmit: PropTypes.bool,
    showResetButton: PropTypes.bool,
    onBeforeSubmit: PropTypes.func,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onDataGet: PropTypes.func,
    OnGetExportValue: PropTypes.func,
    onMount: PropTypes.func,
    onError: PropTypes.func,
};

OwpSearchHeader.defaultProps = {
    className: '',
    gridId: '',
    gridIndex: 0,
    autoSubmit: false,
    showResetButton: true,
    onMount: () => {},
    onError: () => {},
};

export default withStyles(styles, { withTheme: true })(OwpSearchHeader);

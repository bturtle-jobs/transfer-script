import { Button, withStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';
import Formsy from 'formsy-react';
import { isPlainObject, mapKeys, throttle } from 'lodash';
import FuseAnimate from 'owp/@fuse/components/FuseAnimate/FuseAnimate';
import { query, queryAll } from 'owp/api';
import { getAccessToken } from 'owp/auth';
import store from 'owp/store';
import { resetAutoComplate } from 'owp/store/actions/owp';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

const _dispatch = throttle((action) => {
    store.dispatch(action);
}, 1000);

const propTypes = {
    isReady: PropTypes.bool,
    url: PropTypes.string,
    urls: PropTypes.arrayOf(PropTypes.string),
    showResetButton: PropTypes.bool,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onError: PropTypes.func,
    onSearchClick: PropTypes.func,
    forwaredRef: PropTypes.func,
    afterMapping: PropTypes.func,
};

const defaultProps = {
    isReady: true,
    showResetButton: true,
    onSubmit: () => {},
    onReset: () => {},
    onError: () => {},
    onSearchClick: (event) => {},
};

const styles = (theme) => ({
    root: {},
    button: {
        margin: theme.spacing.unit,
        whiteSpace: 'noWrap',
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

class OwpSearchForm2 extends Component {
    getAccessToken = () => {
        return getAccessToken();
    };

    submit = async (data) => {
        if (typeof this.props.afterMapping === 'function') {
            data = this.props.afterMapping(data);
        }

        if (!this.props.url && !this.props.urls) {
            this.props.onSubmit(data);
            return;
        }

        const jsonData = Object.entries(data).reduce((obj, [rootKey, value]) => {
            if (isPlainObject(value)) {
                const newItem = mapKeys(value, (_, key) => {
                    return `${rootKey}.${key}`;
                });
                obj = { ...obj, ...newItem };
            }
            return obj;
        }, {});
        jsonData.VER = '2';

        try {
            const data = !!this.props.url
                ? await query({
                      url: this.props.url,
                      params: {
                          jsondata: JSON.stringify(jsonData),
                          TOKEN: this.getAccessToken(),
                      },
                  })
                : await queryAll(
                      this.props.urls.map((url) => ({
                          url,
                          params: {
                              jsondata: JSON.stringify(jsonData),
                              TOKEN: this.getAccessToken(),
                          },
                      }))
                  );

            this.props.onSubmit(data);
        } catch (error) {
            this.props.onError(error);
        }
    };

    reset = () => {
        this.props.onReset();
        _dispatch(resetAutoComplate(true));
    };

    submitFormManually = () => {
        if (this.form) {
            this.form.submit();
        }
    };

    componentDidMount() {
        if (typeof this.props.forwaredRef === 'function') {
            this.props.forwaredRef(this);
        }
    }

    render() {
        const { classes, isReady } = this.props;

        return (
            <Formsy
                ref={(ref) => (this.form = ref)}
                mapping={this.props.mapping}
                onSubmit={this.submit}
                className="flex flex1 w-full items-center justify-between"
            >
                <div className="items-end">{this.props.children}</div>
                <div className="flex items-end">
                    <div className="flex items-end">
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                type="submit"
                                disabled={!isReady}
                                onClick={this.props.onSearchClick}
                            >
                                <SearchIcon
                                    className={classNames(classes.leftIcon, classes.iconSmall)}
                                />
                                검&nbsp;&nbsp;&nbsp;색
                            </Button>
                        </FuseAnimate>
                        {this.props.showResetButton && (
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Button
                                    variant="outlined"
                                    className={classes.button}
                                    onClick={this.props.onReset}
                                >
                                    <ClearAllIcon
                                        className={classNames(classes.leftIcon, classes.iconSmall)}
                                    />
                                    초기화
                                </Button>
                            </FuseAnimate>
                        )}
                        <input
                            type="submit"
                            className="hidden"
                            ref={(component) => {
                                this.myButton = component;
                            }}
                        />
                    </div>
                </div>
            </Formsy>
        );
    }
}

OwpSearchForm2.propTypes = propTypes;
OwpSearchForm2.defaultProps = defaultProps;

const StyledOwpSearchForm = withStyles(styles, { withTheme: true })(OwpSearchForm2);

export default React.forwardRef((props, ref) => (
    <StyledOwpSearchForm {...props} forwaredRef={ref} />
));

import { Icon, IconButton, Snackbar, SnackbarContent, withStyles } from '@material-ui/core';
import { amber, blue, green } from '@material-ui/core/colors';
import classNames from 'classnames';
import * as Actions from 'owp/store/actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const styles = (theme) => ({
    root: {},
    success: {
        backgroundColor: green[600],
        color: '#ffffff',
    },
    error: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.getContrastText(theme.palette.error.dark),
    },
    info: {
        backgroundColor: blue[600],
        color: '#ffffff',
    },
    warning: {
        backgroundColor: amber[600],
        color: '#ffffff',
    },
});

const variantIcon = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error_outline',
    info: 'info',
};

class FuseMessage extends Component {
    handleClose = (evt, reason) => {
        // if (reason === 'clickaway') {
        //     return;
        // }

        this.props.hideMessage();
    };

    render() {
        const { classes, options } = this.props;

        return (
            <Snackbar
                {...options}
                open={this.props.state}
                onClose={this.handleClose}
                classes={{
                    root: classes.root,
                }}
                ContentProps={{
                    variant: 'body2',
                    headlineMapping: {
                        body1: 'div',
                        body2: 'div',
                    },
                }}
            >
                <SnackbarContent
                    className={classNames(classes[options.variant])}
                    message={
                        <div className="flex items-center">
                            {variantIcon[options.variant] && (
                                <Icon className="mr-8" color="inherit">
                                    {variantIcon[options.variant]}
                                </Icon>
                            )}
                            {options.message}
                        </div>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleClose}
                        >
                            <Icon>close</Icon>
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            hideMessage: Actions.hideMessage,
        },
        dispatch
    );
}

function mapStateToProps({ fuse }) {
    return {
        state: fuse.message.state,
        options: fuse.message.options,
    };
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FuseMessage));

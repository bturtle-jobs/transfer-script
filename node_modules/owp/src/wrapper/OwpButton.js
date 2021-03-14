import { Button, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import React, { Component } from 'react';
import FuseAnimate from '../@fuse/components/FuseAnimate/FuseAnimate';

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

class OwpButton extends Component {
    render() {
        const {
            className,
            style,
            fullWidth,
            classes,
            variant,
            color,
            size,
            delay,
            disabled,
            onClick,
            type,
        } = this.props;

        return (
            <FuseAnimate animation="transition.slideRightIn" delay={delay}>
                <Button
                    fullWidth={fullWidth}
                    className={classNames(classes.button, className)}
                    style={style}
                    variant={variant}
                    color={color}
                    size={size}
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                >
                    {this.props.children}
                </Button>
            </FuseAnimate>
        );
    }
}

OwpButton.defaultProps = {
    className: '',
    style: {},
    variant: 'outlined',
    color: 'primary',
    size: 'small',
    fullWidth: false,
    type: '',
    delay: 300,
    disabled: false,
    onClick: () => {},
};

export default withStyles(styles, { withTheme: true })(OwpButton);

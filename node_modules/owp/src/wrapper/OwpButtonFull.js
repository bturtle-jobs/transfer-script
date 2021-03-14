import React, {Component} from 'react';
import {Button, withStyles} from '@material-ui/core';
import FuseAnimate from "../@fuse/components/FuseAnimate/FuseAnimate";

const styles = theme => ({
    root: {},
    button: {
        margin: 0,
        whiteSpace: 'noWrap',
        width: '100%'
    },
    leftIcon : {
        marginRight: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    },
    iconSmall: {
        fontSize: 16
    }
});

class OwpButton extends Component {

    render()
    {
        const {classes,variant,color,size,onClick,type,style} = this.props;

        return (
            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button variant={variant} color={color} size={size} className={classes.button} onClick={onClick} type={type}>
                    {this.props.children}
                </Button>
            </FuseAnimate>
        );
    }
}

OwpButton.defaultProps = {
    variant: "outlined",
    color: "primary",
    size: "small"
};

export default withStyles(styles, {withTheme: true})(OwpButton);

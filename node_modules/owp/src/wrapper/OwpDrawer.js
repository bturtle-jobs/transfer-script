import React, {Component} from 'react';
import Drawer from "@material-ui/core/Drawer";
import {withStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        // height: 'calc(100% - 64px)',
        width: 'calc(100% - 280px)',
        // top: 64,
        left: 280
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    }
});

class OwpDrawer extends Component {
    state = {
        top   : false,
        left  : false,
        bottom: false,
        right : false
    };

    toggleDrawer = (side, open) => () => {

        this.setState({
            [side]: open
        });
    };

    showDrawer = () => {

        this.setState({
            right: true
        });

    };

    render()
    {
        const classes = this.props.classes;

        return (
            <React.Fragment>
                <div>
                    {/*<Button onClick={this.toggleDrawer('right', true)}>Open Right</Button>*/}
                    <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}
                            classes={{paper: classes.paper}}
                            transitionDuration={{ enter: 0, exit: 0 }}
                    >
                        <div className={classes.root}>
                        <AppBar position="sticky" color="secondary" role="button"
                                onClick={this.toggleDrawer('right', false)}
                                onKeyDown={this.toggleDrawer('right', false)}>
                                <Toolbar>
                                    <Typography variant="h6" color="inherit" className={classes.grow}>

                                    </Typography>
                                    <IconButton
                                        aria-haspopup="true"
                                        color="inherit"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Toolbar>
                        </AppBar>
                        {/*{this.props.children}*/}
                        {React.cloneElement(this.props.children, {...this.props})}
                        </div>
                    </Drawer>
                </div>
            </React.Fragment>
        )
    };
}
export default withStyles(styles, {withTheme: true})(OwpDrawer);
//export default OwpDrawer;

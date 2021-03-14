import { MuiThemeProvider } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { FuseScrollbars, FuseThemes } from 'owp/@fuse';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    rightSidebarHeader: PropTypes.node,
    rightSidebarContent: PropTypes.node,
    rightSidebarVariant: PropTypes.node,
    leftSidebarHeader: PropTypes.node,
    leftSidebarContent: PropTypes.node,
    leftSidebarVariant: PropTypes.node,
    header: PropTypes.node,
    content: PropTypes.node,
    contentToolbar: PropTypes.node,
    innerScroll: PropTypes.bool,
};

const defaultProps = {};

const drawerWidth = 240;
const headerHeight = 200;
const toolbarHeight = 64;
const headerContentHeight = headerHeight - toolbarHeight;

const styles = (theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100%',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: theme.palette.background.default,
    },
    innerScroll: {
        flex: '1 1 auto',
        height: '100%',
    },
    topBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: headerHeight,
        // backgroundImage: 'url("../../assets/images/backgrounds/header-bg.png")',
        backgroundColor: theme.palette.primary.dark,
        backgroundSize: 'cover',
        pointerEvents: 'none',
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 3.2rem',
        flex: '1 1 100%',
        zIndex: 2,
        maxWidth: '100%',
        minWidth: 0,
        minHeight: 0,
        [theme.breakpoints.down('xs')]: {
            padding: '0 1.6rem',
        },
    },
    header: {
        // height   : headerContentHeight,
        // minHeight: headerContentHeight,
        // maxHeight: headerContentHeight,
        display: 'flex',
        color: theme.palette.primary.contrastText,
        paddingTop: 30,
        paddingBottom: 30,
    },
    noheader: {
        height: 24,
        minHeight: 24,
        maxHeight: 24,
        display: 'flex',
        color: theme.palette.primary.contrastText,
    },
    headerSidebarToggleButton: {
        color: theme.palette.primary.contrastText,
    },
    contentCard: {
        display: 'flex',
        flex: '1 1 100%',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        minHeight: 0,
        borderRadius: '8px 8px 0 0',
    },
    toolbar: {
        height: toolbarHeight,
        minHeight: toolbarHeight,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid ' + theme.palette.divider,
    },
    content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto',
        '-webkit-overflow-scrolling': 'touch',
    },
    sidebarWrapper: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 5,
        overflow: 'hidden',
        '&.permanent': {
            [theme.breakpoints.up('lg')]: {
                zIndex: 1,
                position: 'relative',
            },
        },
    },
    sidebar: {
        position: 'absolute',
        '&.permanent': {
            [theme.breakpoints.up('lg')]: {
                backgroundColor: 'transparent',
                position: 'relative',
                border: 'none',
                overflow: 'hidden',
            },
        },
        width: drawerWidth,
        height: '100%',
    },
    leftSidebar: {},
    rightSidebar: {},
    sidebarHeader: {
        height: headerHeight,
        minHeight: headerHeight,
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark,
        '&.permanent': {
            [theme.breakpoints.up('lg')]: {
                backgroundColor: 'transparent',
            },
        },
    },
    sidebarContent: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        [theme.breakpoints.up('lg')]: {
            overflow: 'auto',
            '-webkit-overflow-scrolling': 'touch',
        },
    },
    backdrop: {
        position: 'absolute',
    },
});

class OwpPageCarded extends React.Component {
    state = {
        leftSidebar: false,
        rightSidebar: false,
    };

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined);
        }
    }

    handleDrawerToggle = (sidebarId) => {
        this.setState({ [sidebarId]: !this.state[sidebarId] });
    };

    toggleLeftSidebar = () => {
        this.handleDrawerToggle('leftSidebar');
    };

    toggleRightSidebar = () => {
        this.handleDrawerToggle('rightSidebar');
    };

    toggleSidebar = (id) => {
        this.handleDrawerToggle(id);
    };

    render() {
        const {
            classes,
            rightSidebarHeader,
            rightSidebarContent,
            rightSidebarVariant,
            leftSidebarHeader,
            leftSidebarContent,
            leftSidebarVariant,
            header,
            content,
            contentToolbar,
            innerScroll,
        } = this.props;
        const isRightSidebar = rightSidebarHeader || rightSidebarContent;
        const isLeftSidebar = leftSidebarHeader || leftSidebarContent;

        const Sidebar = (header, content, variant) => (
            <React.Fragment>
                {header && (
                    <MuiThemeProvider theme={FuseThemes['mainThemeDark']}>
                        <div className={classNames(classes.sidebarHeader, variant)}>{header}</div>
                    </MuiThemeProvider>
                )}

                {content && (
                    <FuseScrollbars className={classes.sidebarContent} enable={innerScroll}>
                        {content}
                    </FuseScrollbars>
                )}
            </React.Fragment>
        );

        const SidebarWrapper = (header, content, sidebarId, variant) => (
            <React.Fragment>
                <Hidden lgUp={variant === 'permanent'}>
                    <Drawer
                        className={classNames(classes.sidebarWrapper, variant)}
                        variant="temporary"
                        anchor={sidebarId === 'leftSidebar' ? 'left' : 'right'}
                        open={this.state[sidebarId]}
                        onClose={(ev) => this.handleDrawerToggle(sidebarId)}
                        classes={{
                            paper: classNames(
                                classes.sidebar,
                                variant,
                                sidebarId === 'leftSidebar'
                                    ? classes.leftSidebar
                                    : classes.rightSidebar
                            ),
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        container={this.root}
                        BackdropProps={{
                            classes: {
                                root: classes.backdrop,
                            },
                        }}
                        onClick={(ev) => this.handleDrawerToggle(sidebarId)}
                    >
                        {Sidebar(header, content, variant)}
                    </Drawer>
                </Hidden>
                {variant === 'permanent' && (
                    <Hidden mdDown>
                        <Drawer
                            variant="permanent"
                            className={classNames(classes.sidebarWrapper, variant)}
                            open={this.state[sidebarId]}
                            classes={{
                                paper: classNames(
                                    classes.sidebar,
                                    variant,
                                    sidebarId === 'leftSidebar'
                                        ? classes.leftSidebar
                                        : classes.rightSidebar
                                ),
                            }}
                        >
                            {Sidebar(header, content, variant)}
                        </Drawer>
                    </Hidden>
                )}
            </React.Fragment>
        );

        return (
            <div
                className={classNames(classes.root, innerScroll && classes.innerScroll)}
                ref={(root) => {
                    this.root = root;
                }}
            >
                <div className={classes.topBg} />

                {isLeftSidebar &&
                    SidebarWrapper(
                        leftSidebarHeader,
                        leftSidebarContent,
                        'leftSidebar',
                        leftSidebarVariant || 'permanent'
                    )}

                <div
                    className={classNames(
                        classes.contentWrapper,
                        isLeftSidebar &&
                            (leftSidebarVariant === undefined ||
                                leftSidebarVariant === 'permanent') &&
                            'lg:pl-0',
                        isRightSidebar &&
                            (rightSidebarVariant === undefined ||
                                rightSidebarVariant === 'permanent') &&
                            'lg:pr-0'
                    )}
                >
                    {/*<div className={"min-h-72 h-72 sm:h-136 sm:min-h-136"}>*/}
                    {header && (
                        <div className={classes.header}>
                            {header && (
                                <MuiThemeProvider theme={FuseThemes['mainThemeDark']}>
                                    <div
                                        className={'flex flex1 w-full items-center justify-between'}
                                    >
                                        {header}
                                    </div>
                                </MuiThemeProvider>
                            )}
                        </div>
                    )}

                    {!header && <div className={classes.noheader}></div>}

                    <div className={classNames(classes.contentCard, innerScroll && 'inner-scroll')}>
                        {contentToolbar && <div className={classes.toolbar}>{contentToolbar}</div>}

                        {content && (
                            <FuseScrollbars className={classes.content} enable={innerScroll}>
                                <div style={{ height: '100%' }}>{content}</div>
                            </FuseScrollbars>
                        )}
                    </div>
                </div>

                {isRightSidebar &&
                    SidebarWrapper(
                        rightSidebarHeader,
                        rightSidebarContent,
                        'rightSidebar',
                        rightSidebarVariant || 'permanent'
                    )}
            </div>
        );
    }
}

OwpPageCarded.propTypes = propTypes;
OwpPageCarded.defaultProps = defaultProps;

export default withStyles(styles, { withTheme: true })(OwpPageCarded);

import {
    AppBar,
    Drawer,
    Hidden,
    Icon,
    IconButton,
    MuiThemeProvider,
    Toolbar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import _ from 'lodash';
import { FuseDialog, FuseMessage, FuseScrollbars, FuseThemes } from 'owp/@fuse';
import * as Actions from 'owp/store/actions';
import React, { Component } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import { connect } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import { renderRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

const isMobileOrTablet = isMobile || isTablet;

const defaultProps = {
    navbarHeaderStyle: {},
};

const styles = (config = {}) => (theme) => {
    const navbarWidth = _.get(config, 'navbarWidth', 280);

    return {
        root: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            '&.boxed': {
                maxWidth: 1280,
                margin: '0 auto',
                boxShadow: theme.shadows[3],
            },
            '& table.simple tbody tr td': {
                borderColor: theme.palette.divider,
            },
            '& table.simple thead tr th': {
                borderColor: theme.palette.divider,
            },
            '& a:not([role=button])': {
                color: theme.palette.secondary.main,
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                },
            },
            '& [class^="border-"]': {
                borderColor: theme.palette.divider,
            },
            '& [class*="border-"]': {
                borderColor: theme.palette.divider,
            },
            '&.scroll-body': {
                '& $wrapper': {},
                '& $contentWrapper': {},
                '& $content': {},
            },
            '&.scroll-content': {
                '& $wrapper': {},
                '& $contentWrapper': {},
                '& $content': {},
            },
        },
        wrapper: {
            display: 'flex',
            position: 'relative',
            width: '100%',
            height: '100%',
        },
        contentWrapper: {
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 3,
            overflow: 'hidden',
            flex: '1 1 auto',
        },
        content: {
            position: 'relative',
            display: 'flex',
            overflow: 'auto',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            '-webkit-overflow-scrolling': 'touch',
        },
        contentNoScroll: {
            position: 'relative',
            display: 'flex',
            overflow: 'hidden',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            '-webkit-overflow-scrolling': 'touch',
        },
        navbarWrapper: {
            zIndex: 4,
            [theme.breakpoints.up('lg')]: {
                width: navbarWidth,
                minWidth: navbarWidth,
            },
        },
        navbarPaperWrapper: {},
        navbar: {
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            width: navbarWidth,
            minWidth: navbarWidth,
            height: '100%',
            zIndex: 4,
            transition: theme.transitions.create(['width', 'min-width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.shorter,
            }),
            boxShadow: theme.shadows[3],
        },
        navbarButton: {
            '&.right': {
                borderLeft: '1px solid ' + theme.palette.divider,
            },
            '&.left': {
                borderRight: '1px solid ' + theme.palette.divider,
            },
        },
        navbarLeft: {
            left: 0,
        },
        navbarRight: {
            right: 0,
        },
        navbarWrapperFolded: {
            [theme.breakpoints.up('lg')]: {
                width: 64,
                minWidth: 64,
            },
        },
        navbarFolded: {
            position: 'absolute',
            width: 64,
            minWidth: 64,
            top: 0,
            bottom: 0,
        },
        navbarFoldedOpen: {
            width: navbarWidth,
            minWidth: navbarWidth,
        },
        navbarFoldedClose: {
            '& $navbarHeader': {
                '& .logo-icon': {
                    width: 32,
                    height: 32,
                },
                '& .logo-text': {
                    opacity: 0,
                },
                '& .react-badge': {
                    opacity: 0,
                },
            },
            '& .list-item-text, & .arrow-icon': {
                opacity: 0,
            },
            '& .list-subheader .list-subheader-text': {
                opacity: 0,
            },
            '& .list-subheader:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                minWidth: 16,
                borderTop: '2px solid',
                opacity: 0.2,
            },
            '& .collapse-children': {
                display: 'none',
            },
            '& .user': {
                '& .username, & .email': {},
                '& .avatar': {
                    width: 50,
                    height: 40,
                    //top    : 32,
                    top: 16,
                    padding: 0,
                    borderRadius: 0,
                },
            },
            '& .avatar': {
                //display  : 'none',
                left: '40%',
                '& > img': {
                    //backgroundImage : 'url("http://localhost:4003/assets/images/logos/owp_logo_black.svg")',
                    content: `url("${_.get(
                        config,
                        'navbarLogoThumbUrl',
                        '/assets/images/logos/logo.svg'
                    )}")`,
                },
            },
            '& .handleIcon': {
                display: 'none',
            },
            '& .list-item.active': {
                marginLeft: 12,
                width: 40,
                padding: 12,
                //borderRadius: 20,
                '&.square': {
                    borderRadius: 0,
                    marginLeft: 0,
                    paddingLeft: 24,
                    width: '100%',
                },
            },
        },
        navbarHeaderWrapper: {
            display: 'flex',
            alignItems: 'center',
            flex: '0 1 auto',
            flexDirection: 'row',
            height: 71,
            minHeight: 71,
        },
        navbarHeader: {
            //display: 'flex',
            flex: '1 0 auto',
            padding: '0 8px 0 16px',
        },
        navbarContent: {
            overflowX: 'hidden',
            overflowY: 'auto',
            '-webkit-overflow-scrolling': 'touch',
            background:
                'linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 40px, 100% 10px',
            backgroundAttachment: 'local, scroll',
        },
        toolbarWrapper: {
            display: 'flex',
            position: 'relative',
            zIndex: 5,
        },
        toolbar: {
            display: 'flex',
            flex: '1 0 auto',
        },
        footerWrapper: {
            position: 'relative',
            zIndex: 5,
        },
        footer: {
            display: 'flex',
            flex: '1 0 auto',
        },
    };
};

function mapNavbarToProps({ fuse }) {
    // console.log("mapNavbarToProps -> fuse", fuse)
    return {
        navbar: fuse.navbar,
        settings: fuse.settings.current,
    };
}
const FuseNavbar = connect(mapNavbarToProps)(
    ({
        classes,
        settings,
        navbar,
        navbarHeader,
        navbarHeaderStyle,
        navbarContent,
        navbarCloseMobile,
        navbarOpenFolded,
        navbarCloseFolded,
        children,
        setDefaultSettings,
    }) => {
        if (get(settings, 'layout.config.navbar.display') === false) {
            return null;
        }

        const handleToggleFolded = () => {
            setDefaultSettings(
                _.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded)
            );
        };
        const layoutConfig = settings.layout.config;
        const navbarHeaderTemplate = (
            <AppBar
                color="primary"
                position="static"
                elevation={0}
                className={classes.navbarHeaderWrapper}
                style={navbarHeaderStyle}
            >
                <div className={classes.navbarHeader}>{navbarHeader}</div>
                {isMobileOrTablet ? (
                    <IconButton onClick={navbarCloseMobile} color="inherit">
                        <Icon>close</Icon>
                    </IconButton>
                ) : (
                    <IconButton onClick={handleToggleFolded} color="inherit" className="handleIcon">
                        <Icon>menu</Icon>
                    </IconButton>
                )}
            </AppBar>
        );

        const navbarContentTemplate = (
            <FuseScrollbars className={`${classes.navbarContent} hidden-scrollbar`}>
                {navbarContent}
            </FuseScrollbars>
        );

        return (
            <MuiThemeProvider theme={FuseThemes[settings.theme.navbar]}>
                <div
                    id="fuse-navbar"
                    className={
                        isMobileOrTablet
                            ? ''
                            : classNames(
                                  classes.navbarWrapper,
                                  layoutConfig.navbar.folded && classes.navbarWrapperFolded
                              )
                    }
                >
                    <Hidden mdDown={!isMobileOrTablet} xlDown={isMobileOrTablet}>
                        <div
                            className={classNames(
                                classes.navbar,
                                classes['navbar' + _.upperFirst(layoutConfig.navbar.position)],
                                layoutConfig.navbar.folded && classes.navbarFolded,
                                layoutConfig.navbar.folded &&
                                    navbar.foldedOpen &&
                                    classes.navbarFoldedOpen,
                                layoutConfig.navbar.folded &&
                                    !navbar.foldedOpen &&
                                    classes.navbarFoldedClose
                            )}
                            onMouseEnter={() =>
                                layoutConfig.navbar.folded &&
                                !navbar.foldedOpen &&
                                navbarOpenFolded()
                            }
                            onMouseLeave={() =>
                                layoutConfig.navbar.folded &&
                                navbar.foldedOpen &&
                                navbarCloseFolded()
                            }
                            style={{
                                backgroundColor:
                                    FuseThemes[settings.theme.navbar].palette.background.default,
                            }}
                        >
                            {navbarHeaderTemplate}
                            {navbarContentTemplate}
                        </div>
                    </Hidden>

                    <Hidden lgUp={!isMobileOrTablet}>
                        <Drawer
                            open={navbar.mobileOpen}
                            anchor={layoutConfig.navbar.position}
                            variant="temporary"
                            classes={{
                                paper: classes.navbar,
                            }}
                            onClose={navbarCloseMobile}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {navbarHeaderTemplate}
                            {navbarContentTemplate}
                        </Drawer>
                    </Hidden>
                </div>
            </MuiThemeProvider>
        );
    }
);

function mapToolbarToProps({ fuse }) {
    return {
        settings: fuse.settings.current,
    };
}

const FuseToolbar = connect(mapToolbarToProps)(
    ({ classes, toolbar, settings, navbarOpenMobile, children }) => {
        const layoutConfig = settings.layout.config;

        if (get(layoutConfig, 'toolbar.display') === false) {
            return null;
        }

        return (
            <MuiThemeProvider theme={FuseThemes[settings.theme.toolbar]}>
                <AppBar
                    id="fuse-toolbar"
                    className={classNames(classes.toolbarWrapper)}
                    color="secondary"
                >
                    <Toolbar className="p-0">
                        {layoutConfig.navbar.display && layoutConfig.navbar.position === 'left' && (
                            <Hidden lgUp={!isMobileOrTablet}>
                                <IconButton
                                    className={classNames(
                                        classes.navbarButton,
                                        'w-64 h-64 rounded-none',
                                        layoutConfig.navbar.position
                                    )}
                                    aria-label="open drawer"
                                    onClick={navbarOpenMobile}
                                >
                                    <Icon>menu</Icon>
                                </IconButton>
                            </Hidden>
                        )}
                        <div className={classes.toolbar}>{toolbar}</div>
                        {layoutConfig.navbar.display && layoutConfig.navbar.position === 'right' && (
                            <Hidden lgUp={!isMobileOrTablet}>
                                <IconButton
                                    className={classNames(
                                        classes.navbarButton,
                                        'w-64 h-64 rounded-none',
                                        layoutConfig.navbar.position
                                    )}
                                    aria-label="open drawer"
                                    onClick={navbarOpenMobile}
                                >
                                    <Icon>menu</Icon>
                                </IconButton>
                            </Hidden>
                        )}
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>
        );
    }
);

function mapFooterToProps({ fuse }) {
    return {
        settings: fuse.settings.current,
    };
}
const FuseFooter = connect(mapFooterToProps)(({ settings, classes, footer }) => {
    return (
        <MuiThemeProvider theme={FuseThemes[settings.theme.footer]}>
            <AppBar id="fuse-footer" className={classNames(classes.footerWrapper)} color="default">
                <Toolbar className="p-0">
                    <div className={classNames(classes.footer)}>{footer}</div>
                </Toolbar>
            </AppBar>
        </MuiThemeProvider>
    );
});

const FuseLayoutContent = React.memo(FuseLayoutContentComponent, (prevProps, nextProps) => {
    // console.log('prevProps, nextProps', prevProps, nextProps);
    return true;
});
function FuseLayoutContentComponent({
    classes,
    // layoutConfig,
    toolbar,
    toolbarTemplate,
    navBarTemplate,
    // footer,
    // footerTemplate,
    contentWrapper,
    leftSidePanel,
    // rightSidePanel,
    routes,
    children,
}) {
    // console.log('FuseLayoutContentComponent');
    return (
        <div
            id="fuse-layout"
            className={classNames(classes.root, 'fullwidth', 'scroll-' + 'content')}
        >
            {leftSidePanel}

            <div className="flex flex-1 flex-col overflow-hidden relative">
                <div className={classes.wrapper}>
                    {navBarTemplate}

                    <div className={classes.contentWrapper}>
                        {toolbar && toolbarTemplate}

                        <FuseScrollbars className={classes.content}>
                            <FuseDialog />

                            {renderRoutes(routes)}
                            {children}

                            {/* {footer &&
                                layoutConfig.footer.display &&
                                layoutConfig.footer.position === 'below' &&
                                layoutConfig.footer.style !== 'fixed' &&
                                footerTemplate} */}
                        </FuseScrollbars>

                        {/* {footer &&
                            layoutConfig.footer.display &&
                            layoutConfig.footer.position === 'below' &&
                            layoutConfig.footer.style === 'fixed' &&
                            footerTemplate} */}

                        {contentWrapper}
                    </div>
                </div>

                {/* {footer &&
                    layoutConfig.footer.display &&
                    layoutConfig.footer.position === 'above' &&
                    footerTemplate} */}
            </div>

            <FuseMessage />
        </div>
    );
}

class FuseLayout1 extends Component {
    render() {
        // console.warn('FuseLayout:: rendered 2222');
        // const { settingsConfig, ...restProps } = this.props;

        const navBarTemplate = <FuseNavbar {...this.props} />;

        const toolbarTemplate = <FuseToolbar {...this.props} />;

        // const footerTemplate = <FuseFooter {...this.props} />;

        return (
            <FuseLayoutContent
                {...this.props}
                toolbarTemplate={toolbarTemplate}
                navBarTemplate={navBarTemplate}
                // footerTemplate={footerTemplate}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setSettings: Actions.setSettings,
            setDefaultSettings: Actions.setDefaultSettings,
            resetSettings: Actions.resetSettings,
            navbarOpenFolded: Actions.navbarOpenFolded,
            navbarCloseFolded: Actions.navbarCloseFolded,
            navbarOpenMobile: Actions.navbarOpenMobile,
            navbarCloseMobile: Actions.navbarCloseMobile,
        },
        dispatch
    );
}

function mapStateToProps({ fuse, owp }) {
    return {
        // defaultSettings: fuse.settings.defaults,
        // settingsConfig: fuse.settings.current.layout.config,
        // navbar: fuse.navbar,
        config: owp.config,
    };
}

FuseLayout1.defaultProps = defaultProps;

const withStylesProps = (_styles) => (Component) => ({ config, ...restProps }) => {
    const StyledComponent = withStyles(_styles(config))(Component);
    return <StyledComponent {...restProps} config={config} />;
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps, null, {
        areStatePropsEqual: (next, prev) => {
            return shallowEqual(next, prev);
        },
    })(withStylesProps(styles)(FuseLayout1))
);

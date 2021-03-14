import { MuiThemeProvider } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { FuseScrollbars, FuseThemes } from 'owp/@fuse';
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
    /**
     * 멀티 섹션으로 이뤄진 컨텐츠를 렌더링 하기 위한 prop
     */
    contentList: PropTypes.arrayOf(
        PropTypes.shape({
            content: PropTypes.node,
            contentToolbar: PropTypes.node,
        })
    ),

    /**
     * https://github.com/leeinbae/owp/issues/72 문제로 사용 못함
     */
    innerScroll: PropTypes.bool,

    /**
     * FusePageCarded의 prop과 동일
     */
    rightSidebarHeader: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    rightSidebarContent: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    rightSidebarVariant: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    leftSidebarHeader: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    leftSidebarContent: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    leftSidebarVariant: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    header: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    content: PropTypes.node,

    /**
     * FusePageCarded의 prop과 동일
     */
    contentToolbar: PropTypes.node,
};

const defaultProps = {};

const drawerWidth = 240;
const headerHeight = 240;
const toolbarHeight = 64;
const headerContentHeight = headerHeight - toolbarHeight;

export const styles = (theme) => ({
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
        height: headerContentHeight,
        minHeight: headerContentHeight,
        maxHeight: headerContentHeight,
        display: 'flex',
        color: theme.palette.primary.contrastText,
    },
    headerSidebarToggleButton: {
        color: theme.palette.primary.contrastText,
    },
    contentCard: {
        display: 'flex',
        // flex           : '1 1 100%',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        minHeight: 0,
        borderRadius: '8px',
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

/**
 * FusePageCarded 컴포넌트를 커스터마이징 한 컴포넌트로
 * `contentList` prop을 제외하곤 기존 컴포넌트(FusePageCarded)와 동일하다.
 */
class PageCarded extends React.Component {
    state = {
        leftSidebar: false,
        rightSidebar: false,
    };

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }

        if (this.props.adjustBg) {
            this.topBgRef.style.height = '120px';
            this.headerRef.style.height = `${120 - toolbarHeight}px`;
            this.headerRef.style.minHeight = `${120 - toolbarHeight}px`;
            this.headerRef.style.maxHeight = `${120 - toolbarHeight}px`;
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
            contentList,
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
                <div ref={(topBgRef) => (this.topBgRef = topBgRef)} className={classes.topBg} />

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
                    <div
                        ref={(headerRef) => (this.headerRef = headerRef)}
                        className={classes.header}
                    >
                        {header && (
                            <MuiThemeProvider theme={FuseThemes['mainThemeDark']}>
                                {header}
                            </MuiThemeProvider>
                        )}
                    </div>

                    <div
                        className={classNames(
                            classes.contentCard,
                            innerScroll && 'inner-scroll',
                            'mb-24'
                        )}
                    >
                        {contentToolbar && <div className={classes.toolbar}>{contentToolbar}</div>}

                        {content && (
                            <FuseScrollbars className={classes.content} enable={innerScroll}>
                                {content}
                            </FuseScrollbars>
                        )}
                    </div>

                    {contentList &&
                        contentList.length &&
                        contentList.map(({ content, contentToolbar }, index) => (
                            <div
                                key={index}
                                className={classNames(
                                    classes.contentCard,
                                    innerScroll && 'inner-scroll',
                                    'mb-24'
                                )}
                            >
                                {contentToolbar && (
                                    <div className={classes.toolbar}>{contentToolbar}</div>
                                )}

                                {content && (
                                    <FuseScrollbars
                                        className={classes.content}
                                        enable={innerScroll}
                                    >
                                        {content}
                                    </FuseScrollbars>
                                )}
                            </div>
                        ))}
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

PageCarded.propTypes = propTypes;
PageCarded.defaultProps = defaultProps;

export default withStyles(styles, { withTheme: true })(PageCarded);

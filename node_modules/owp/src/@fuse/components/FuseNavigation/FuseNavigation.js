import { Divider, Hidden, List } from '@material-ui/core';
import { getPath } from 'owp/common';
import { setPageBreadcrumb } from 'owp/store/actions';
import PropTypes from 'prop-types';
import { filter, map, pipe } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseNavHorizontalCollapse from './horizontal/FuseNavHorizontalCollapse';
import FuseNavHorizontalGroup from './horizontal/FuseNavHorizontalGroup';
import FuseNavHorizontalItem from './horizontal/FuseNavHorizontalItem';
import FuseNavVerticalCollapse from './vertical/FuseNavVerticalCollapse';
import FuseNavVerticalGroup from './vertical/FuseNavVerticalGroup';
import FuseNavVerticalItem from './vertical/FuseNavVerticalItem';

const propTypes = {
    navigation: PropTypes.array.isRequired,
};

const defaultProps = {
    layout: 'vertical',
};

const getTitles = (navs, loc) =>
    pipe(
        filter(({ type }) => type !== 'group'),
        map(({ title }) => title)
    )(getPath(navs, loc));

class FuseNavigation extends Component {
    componentDidMount() {
        this.props.setPageBreadcrumb(getTitles(this.props.navigation, this.props.location));
    }

    componentDidUpdate = ({ location }, prevState) => {
        if (location.pathname !== this.props.location.pathname) {
            this.props.setPageBreadcrumb(getTitles(this.props.navigation, this.props.location));
        }
    };

    render() {
        const { navigation, layout, active } = this.props;

        const verticalNav = (
            <List className="whitespace-no-wrap">
                {navigation.map((item) => (
                    <React.Fragment key={item.id}>
                        {item.type === 'group' && (
                            <FuseNavVerticalGroup item={item} nestedLevel={0} active={active} />
                        )}

                        {item.type === 'collapse' && (
                            <FuseNavVerticalCollapse item={item} nestedLevel={0} active={active} />
                        )}

                        {item.type === 'item' && (
                            <FuseNavVerticalItem item={item} nestedLevel={0} active={active} />
                        )}

                        {item.type === 'divider' && <Divider className="my-16" />}
                    </React.Fragment>
                ))}
            </List>
        );

        const horizontalNav = (
            <List className="whitespace-no-wrap flex p-0">
                {navigation.map((item) => (
                    <React.Fragment key={item.id}>
                        {item.type === 'group' && (
                            <FuseNavHorizontalGroup item={item} nestedLevel={0} />
                        )}

                        {item.type === 'collapse' && (
                            <FuseNavHorizontalCollapse item={item} nestedLevel={0} />
                        )}

                        {item.type === 'item' && (
                            <FuseNavHorizontalItem item={item} nestedLevel={0} />
                        )}

                        {item.type === 'divider' && <Divider className="my-16" />}
                    </React.Fragment>
                ))}
            </List>
        );

        if (navigation.length > 0) {
            switch (layout) {
                case 'horizontal': {
                    return (
                        <React.Fragment>
                            <Hidden lgUp>{verticalNav}</Hidden>
                            <Hidden mdDown>{horizontalNav}</Hidden>
                        </React.Fragment>
                    );
                }
                case 'vertical':
                default: {
                    return verticalNav;
                }
            }
        } else {
            return '';
        }
    }
}

FuseNavigation.propTypes = propTypes;
FuseNavigation.defaultProps = defaultProps;

const mapDispatchToProps = {
    setPageBreadcrumb,
};

export default connect(null, mapDispatchToProps)(withRouter(FuseNavigation));

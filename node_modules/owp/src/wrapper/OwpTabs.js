import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";

function TabContainer(props)
{
    return (
        <Typography component="div" style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

const styles = theme => ({
    root         : {
        flexGrow       : 1,
        backgroundColor: theme.palette.background.paper
    },
    tabsRoot     : {
        borderBottom: '1px solid #e8e8e8'
    },
    tabsIndicator: {
        backgroundColor: '#1890ff'
    },
    tabRoot      : {
        textTransform  : 'initial',
        minWidth       : 72,
        fontWeight     : theme.typography.fontWeightRegular,
        marginRight    : theme.spacing.unit * 4,

        '&:hover'      : {
            color  : '#40a9ff',
            opacity: 1
        },
        '&$tabSelected': {
            color     : '#1890ff',
            fontWeight: theme.typography.fontWeightMedium
        },
        '&:focus'      : {
            color: '#40a9ff'
        }
    },
    tabSelected  : {},
    typography   : {
        padding: theme.spacing.unit * 3
    }
});

class OwpTabs extends React.Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render()
    {
        const {classes} = this.props;
        const {value} = this.state;

        return (
            <div className={classes.root}>
                <Tabs
                    value={value}
                    onChange={this.handleChange}
                    classes={{
                        root     : classes.tabsRoot,
                        indicator: classes.tabsIndicator
                    }}
                >
                    {this.props.tabs && this.props.tabs.map((tab,i) =>
                            <Tab key={i}
                                disableRipple
                                classes={{
                                    root    : classes.tabRoot,
                                    selected: classes.tabSelected
                                }}
                                label={tab.label}
                            />
                    )}
                </Tabs>

                {this.props.tabs && this.props.tabs.map((tab,i) =>

                    this.state.value === i && <TabContainer key={i}>{tab.content}</TabContainer>
                )}

            </div>
        );
    }
}

OwpTabs.propTypes = {
    classes: PropTypes.object.isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            content : PropTypes.node
        })
    ),
};

export default withStyles(styles)(OwpTabs);

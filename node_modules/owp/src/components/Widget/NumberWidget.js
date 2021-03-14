import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const NumberWidget = ({ label, value, classes }) => {
    return (
        <Paper className="p-16">
            <Typography inline color="textSecondary" variant="headline">
                {label}:
            </Typography>
            <Typography inline color="textPrimary" variant="headline">
                {value}건
            </Typography>
        </Paper>
    );
};

NumberWidget.propTypes = {};

export default NumberWidget;

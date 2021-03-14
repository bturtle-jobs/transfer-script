import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

const Page = ({ pageTitle, ...restProps }) => {
    return (
        <Grid container className="flex-grow p-24">
            <Grid item {...restProps} xs={12} />
        </Grid>
    );
};

Page.propTypes = {
    pageTitle: PropTypes.string,
};

export default Page;

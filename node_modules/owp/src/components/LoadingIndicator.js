import Fade from '@material-ui/core/Fade';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';

const LoadingIndicator = ({
    classes,
    loading,
    value,
    color,
    variant,
    ...restProps
}) => {
    if (!loading) return null;

    return (
        <Fade unmountOnExit in={true} {...restProps}>
            <LinearProgress value={value} color={color} variant={variant} />
        </Fade>
    );
};

LoadingIndicator.propTypes = {
    loading: PropTypes.bool,
    value: PropTypes.number,
    color: PropTypes.string,
    variant: PropTypes.string,
};

LoadingIndicator.defaultProps = {
    loading: false,
    value: 0,
    color: 'secondary',
    variant: 'indeterminate',
};

export default LoadingIndicator;

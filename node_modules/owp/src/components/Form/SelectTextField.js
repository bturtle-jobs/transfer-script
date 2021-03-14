import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';

const SelectTextField = ({ value, items, onChange, ...restProps }) => {
    return (
        <TextField
            margin="normal"
            {...restProps}
            select
            value={value}
            onChange={event => {
                onChange(event.target.value, event);
            }}
        >
            {items.map(option => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

SelectTextField.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

SelectTextField.defaultProps = {
    items: [],
    onChange: value => {
        console.log(value);
    },
};

export default SelectTextField;

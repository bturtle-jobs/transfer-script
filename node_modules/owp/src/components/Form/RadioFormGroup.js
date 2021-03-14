import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import PropTypes from 'prop-types';
import React from 'react';

const RadioFormGroup = ({ value, items, onChange, ...restProps }) => {
    return (
        <RadioGroup
            {...restProps}
            onChange={event => {
                onChange(event.target.value);
            }}
        >
            {items.map(({ label, value, ...radioProps } = {}) => (
                <FormControlLabel
                    key={value}
                    control={<Radio {...radioProps} />}
                    label={label}
                    value={value}
                />
            ))}
        </RadioGroup>
    );
};

RadioFormGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.string,
        })
    ),
    value: PropTypes.string,
    onChange: PropTypes.func,
};

RadioFormGroup.defaultProps = {
    items: [],
    onChange: value => {
        console.log(value);
    },
};

export default RadioFormGroup;

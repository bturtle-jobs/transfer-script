import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';
import React from 'react';

const CheckboxFormGroup = ({
    WrapperComponent,
    value: values,
    name,
    items,
    onChange,
    ...restProps
}) => {
    return (
        <WrapperComponent {...restProps}>
            {items.map(({ label, value, ...checkboxProps } = {}) => (
                <FormControlLabel
                    key={value}
                    control={
                        <Checkbox
                            {...checkboxProps}
                            name={name}
                            checked={values.includes(value)}
                            onChange={event => {
                                if (event.target.checked) {
                                    onChange(
                                        [...values, event.target.value],
                                        event
                                    );
                                } else {
                                    onChange(
                                        values.filter(
                                            value =>
                                                value !== event.target.value
                                        ),
                                        event
                                    );
                                }
                            }}
                        />
                    }
                    label={label}
                    value={value}
                />
            ))}
        </WrapperComponent>
    );
};

CheckboxFormGroup.propTypes = {
    WrapperComponent: PropTypes.element,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.node,
            value: PropTypes.string,
        })
    ),
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
};

CheckboxFormGroup.defaultProps = {
    WrapperComponent: FormGroup,
    value: [],
    items: [],
    onChange: value => {
        console.log(value);
    },
};

export default CheckboxFormGroup;

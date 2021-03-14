import { withFormsy } from 'formsy-react';
import omit from 'lodash/omit';
import React, { useEffect } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpRadioGroup from './OwpRadioGroup';

function OwpSearchRadioGroup({
    value,
    defaultValue,
    errorMessage,
    getValue,
    setValue,
    getErrorMessage,
    onChange,
    ...restProps
}) {
    const radioValue = value || getValue();

    useEffect(() => {
        setValue(defaultValue || value);
    }, []);

    const handleChange = (evt, selectedValue) => {
        !value && setValue(selectedValue);
        onChange(evt, selectedValue);
    };

    return (
        <OwpRadioGroup
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            defaultValue={defaultValue}
            value={radioValue}
            errorMessage={errorMessage || getErrorMessage()}
            onChange={handleChange}
        />
    );
}

OwpSearchRadioGroup.defaultProps = {
    defaultValue: '',
    value: '',
    errorMessage: '',
    getValue: () => {},
    setValue: (value) => {},
    getErrorMessage: () => {},
    onChange: (event, value) => {},
};

export default withFormsy(OwpSearchRadioGroup);

import { withFormsy } from 'formsy-react';
import omit from 'lodash/omit';
import React, { useEffect } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpCheckBox from './OwpCheckBox';

function OwpSearchCheckBox({
    defaultValue,
    value,
    errorMessage,
    getValue,
    setValue,
    getErrorMessage,
    onChange,
    ...restProps
}) {
    const checkedValue = value || getValue();

    useEffect(() => {
        setValue(defaultValue || value);
    }, []);

    const handleChange = (evt, checked) => {
        !value && setValue(checked);
        onChange(evt, checked);
    };

    return (
        <OwpCheckBox
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            defaultValue={defaultValue}
            value={checkedValue}
            errorMessage={errorMessage || getErrorMessage()}
            onChange={handleChange}
        />
    );
}

OwpSearchCheckBox.defaultProps = {
    className: '',
    name: '',
    defaultValue: false,
    value: false,
    errorMessage: '',
    getValue: () => {},
    setValue: (value) => {},
    getErrorMessage: () => {},
    onChange: (event, checked) => {},
};

export default withFormsy(OwpSearchCheckBox);

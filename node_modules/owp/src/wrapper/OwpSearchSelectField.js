import { withFormsy } from 'formsy-react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import React, { useEffect } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpSelectField from './OwpSelectField';

function OwpSearchSelectField({
    defaultValue = '',
    value = '',
    getValue = noop,
    setValue = noop,
    onChange = noop,
    ...restProps
}) {
    const selectValue = value || getValue();

    useEffect(() => {
        setValue(defaultValue || value);
    }, []);

    const handleChange = (evt, selected) => {
        !value && setValue(isString(selected) ? selected : get(selected, 'value'));
        onChange(evt, selected);
    };

    return (
        <OwpSelectField
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            defaultValue={defaultValue}
            value={selectValue}
            onChange={handleChange}
        />
    );
}

export default withFormsy(OwpSearchSelectField);

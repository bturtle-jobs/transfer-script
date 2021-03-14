import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import React from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpTextField from './OwpTextField';

function OwpSearchTextField({
    value,
    getValue = noop,
    setValue = noop,
    onChange = noop,
    ...restProps
}) {
    const fieldValue = value || getValue();

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpTextField
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            value={fieldValue}
            setValue={setValue}
            onChange={handleChange}
        />
    );
}

export default withFormsy(OwpSearchTextField);

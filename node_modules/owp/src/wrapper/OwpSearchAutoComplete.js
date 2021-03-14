import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React, { useEffect } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpAutoComplete from './OwpAutoComplete';

function OwpSearchAutoComplete({ name, setValue, onChange, ...restProps }) {
    useEffect(() => {
        setValue('');
    }, []);

    return (
        <OwpAutoComplete
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            name={name}
            onChange={(evt, value) => {
                setValue(value);
                onChange(evt, value);
            }}
        />
    );
}

OwpSearchAutoComplete.defaultProps = {
    className: '',
    id: `owp-search-auto-complete-form-${uniqueId()}`,
    name: 'owp-search-auto-complete-form',
    style: {},
    minInputLength: 2,
    isMulti: false,
    placeholder: '',
    query: null,
    setValue: noop,
    onInputChange: noop,
    onChange: noop,
};

export default withFormsy(OwpSearchAutoComplete);

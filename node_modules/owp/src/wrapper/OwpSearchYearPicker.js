import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { makeNowYYYY } from 'owp/common';
import React, { useMemo } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpYearPicker from './OwpYearPicker';

function OwpSearchYearPicker({ initNow, value, onChange, setValue, getValue, ...restProps }) {
    const yearValue = useMemo(() => {
        const year = value || getValue();
        if (!year && initNow) {
            return makeNowYYYY();
        }

        return value;
    }, []);

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpYearPicker
            {...omit(restProps, OMIT_PROPS_LIST)}
            useReset
            isSearch
            initNow={initNow}
            value={yearValue}
            onChange={handleChange}
        />
    );
}

OwpSearchYearPicker.defaultProps = {
    className: '',
    id: `owp-year-picker-form-${uniqueId()}`,
    name: 'owp-year-picker-form',
    style: {},
    label: '기준연도',
    required: false,
    value: '',
    defaultValue: '',
    initNow: false,
    useClear: true,
    errorMessage: '',
    setValue: noop,
    getValue: noop,
    onChange: (event, value) => {},
};

export default withFormsy(OwpSearchYearPicker);

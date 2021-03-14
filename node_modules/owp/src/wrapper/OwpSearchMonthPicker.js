import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import { makeNowYYYYMM } from 'owp/common';
import React, { useMemo } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpMonthPicker from './OwpMonthPicker';

function OwpSearchMonthPicker({ initNow, value, onChange, setValue, getValue, ...restProps }) {
    const monthValue = useMemo(() => {
        const month = value || getValue();
        if (!month && initNow) {
            return makeNowYYYYMM();
        }

        return value;
    }, []);

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpMonthPicker
            {...omit(restProps, OMIT_PROPS_LIST)}
            isSearch
            useReset
            initNow={initNow}
            value={monthValue}
            onChange={handleChange}
        />
    );
}

OwpSearchMonthPicker.defaultProps = {
    id: `owp-month-picker-form-${uniqueId()}`,
    name: 'owp-month-picker-form',
    className: '',
    style: {},
    label: '기준월',
    value: '',
    errorMessage: '',
    initNow: false,
    useKr: false,
    useClear: true,
    setValue: noop,
    getValue: noop,
    onChange: (event, value) => {},
};

export default withFormsy(OwpSearchMonthPicker);

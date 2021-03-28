import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React, { useMemo } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpDateTimePicker from './OwpDateTimePicker';

function OwpSearchDateTimePicker({ value, onChange, setValue, getValue, ...restProps }) {
    const dateTimeValue = useMemo(() => value || getValue(), []);

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpDateTimePicker
            {...omit(restProps, OMIT_PROPS_LIST)}
            useReset
            isSearch
            value={dateTimeValue}
            onChange={handleChange}
        />
    );
}

OwpSearchDateTimePicker.defaultProps = {
    id: `owp-datetime-picker-form-${uniqueId()}`,
    name: 'owp-datetime-picker-form',
    className: '',
    initNow: false,
    required: false,
    fullWidth: false,
    fullDate: false,
    autoFocus: false,
    useMonth: false,
    useHour: false,
    useSecond: false,
    useClear: true,
    usePicker: true,
    useValidate: true,
    isReset: false,
    inputRef: null,
    inputProps: {},
    InputProps: {},
    position: 'absolute',
    value: '',
    defaultValue: '',
    errorMessage: '',
    setValue: noop,
    getValue: noop,
    onChange: (event, value) => {},
};

export default withFormsy(OwpSearchDateTimePicker);

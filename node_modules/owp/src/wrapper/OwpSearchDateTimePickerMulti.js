import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import React, { useMemo } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpDateTimePickerMulti from './OwpDateTimePickerMulti';

function OwpSearchDateTimePickerMulti({ value, onChange, setValue, getValue, ...restProps }) {
    const datesTimeValue = useMemo(() => value || getValue(), []);

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpDateTimePickerMulti
            {...omit(restProps, OMIT_PROPS_LIST)}
            useReset
            isSearch
            value={datesTimeValue}
            onChange={handleChange}
        />
    );
}

OwpSearchDateTimePickerMulti.defaultProps = {
    id: `owp-date-time-picker-multi-${uniqueId()}`,
    name: `owp-date-time-picker-multi`,
    className: '',
    required: false,
    fullDate: false,
    autoFocus: false,
    autoMove: false,
    initNow: false,
    useForceChange: true,
    useValidate: true,
    useHour: false,
    useSecond: false,
    usePicker: true,
    useClear: true,
    useFilterSameDate: false,
    value: '',
    values: {
        start: '',
        end: '',
    },
    labels: {
        start: '시작일',
        end: '종료일',
    },
    inputProps: {
        start: {},
        end: {},
    },
    InputProps: {
        start: {},
        end: {},
    },
    setValue: noop,
    getValue: noop,
    onChange: (event, value) => {},
};

export default withFormsy(OwpSearchDateTimePickerMulti);

import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';
import { makeNowYYYYMM } from 'owp/common';
import React, { useMemo } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpMonthPickerMulti from './OwpMonthPickerMulti';

function OwpSearchMonthPickerMulti({ initNow, value, onChange, setValue, getValue, ...restProps }) {
    const monthsValue = useMemo(() => {
        const month = value || getValue();
        if (!month && initNow) {
            return range(2)
                .map(() => makeNowYYYYMM())
                .join(',');
        }

        return value;
    }, []);

    const handleChange = (evt) => {
        !value && setValue(evt.target.value);
        onChange(evt, evt.target.value);
    };

    return (
        <OwpMonthPickerMulti
            {...omit(restProps, OMIT_PROPS_LIST)}
            useReset
            isSearch
            initNow={initNow}
            value={monthsValue}
            onChange={handleChange}
        />
    );
}

OwpSearchMonthPickerMulti.defaultProps = {
    id: `owp-month-picker-multi-form-${uniqueId()}`,
    name: `owp-month-picker-multi-form`,
    className: '',
    initNow: false,
    useFilterSameMonth: false,
    position: 'absolute',
    value: '',
    values: {
        start: '',
        end: '',
    },
    labels: {
        start: '시작월',
        end: '종료월',
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

export default withFormsy(OwpSearchMonthPickerMulti);

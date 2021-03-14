import { withFormsy } from 'formsy-react';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import range from 'lodash/range';
import { makeNowYYYYMMDD, makeNowYYYYMMDDHHmm } from 'owp/common';
import React, { useEffect } from 'react';
import { OMIT_PROPS_LIST } from './constants';
import OwpDatePickerMulti from './OwpDatePickerMulti';

function OwpSearchDatePickerMulti({
    initNow,
    fullDate,
    useHour,
    useSecond,
    value,
    onChange,
    setValue,
    getValue,
    ...restProps
}) {
    const datesValue = value || getValue();

    useEffect(() => {
        if (initNow && !datesValue) {
            setValue(
                range(2)
                    .map(() =>
                        fullDate
                            ? makeNowYYYYMMDDHHmm('-', ':').replace(/T/, ' ')
                            : useSecond
                            ? `${makeNowYYYYMMDDHHmm('-', ':').replace(/T/, ' ')}:00`
                            : useHour
                            ? `${makeNowYYYYMMDD('-')}-00`
                            : makeNowYYYYMMDD('-')
                    )
                    .join()
            );
        }
    }, [datesValue]);

    const handleChange = (name, dates = '') => {
        !value && setValue(dates);
        onChange(name, dates);
    };

    return (
        <OwpDatePickerMulti
            {...omit(restProps, OMIT_PROPS_LIST)}
            initNow={initNow}
            fullDate={fullDate}
            useHour={useHour}
            useSecond={useSecond}
            value={datesValue}
            onChange={handleChange}
        />
    );
}

OwpSearchDatePickerMulti.defaultProps = {
    initNow: false,
    fullDate: false,
    useHour: false,
    useSecond: false,
    value: '',
    onChange: noop,
    setValue: noop,
    getValue: noop,
};

export default withFormsy(OwpSearchDatePickerMulti);

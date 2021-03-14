import { Icon, IconButton, TextField } from '@material-ui/core';
import uniqueId from 'lodash/uniqueId';
import { makeDateString, makeNowYYYYMM } from 'owp/common';
import React, { useState } from 'react';
import OwpDateTimePicker from './OwpDateTimePicker';

function MonthPickerDefaultInput({
    label,
    required,
    inputProps,
    InputProps,
    errorMessage,
    isClearMonth,
    useKr,
    useClear,
    value,
    onClick,
    onFocus,
    onKeyDown,
    onChange,
    handleResetMonth,
} = {}) {
    const month = makeDateString(value, { separator: !!useKr ? null : '.', useKr });

    return (
        <>
            <TextField
                label={label}
                required={required}
                inputProps={{ style: { textAlign: 'center', width: 120 }, ...inputProps }}
                value={isClearMonth ? '' : month}
                error={!!errorMessage}
                helperText={errorMessage}
                onClick={onClick}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                InputLabelProps={{
                    shrink: true,
                }}
                /*eslint-disable-next-line*/
                InputProps={{
                    ...InputProps,
                    endAdornment: useClear && (
                        <IconButton
                            disableRipple
                            className="w-16 h-16 p-0"
                            onClick={() => {
                                onChange({ target: { value: '' } });
                            }}
                        >
                            <Icon className="text-14">clear</Icon>
                        </IconButton>
                    ),
                }}
                onChange={(evt) => (evt.target.value = month)}
            />
        </>
    );
}

function OwpMonthPicker({
    initNow,
    useReset,
    value,
    defaultValue,
    dateFormat,
    inputProps,
    onChange,
    ...restProps
}) {
    const [month, setMonth] = useState(!value && initNow ? makeNowYYYYMM() : value);

    return (
        <OwpDateTimePicker
            useMonth
            initNow={initNow}
            useReset={useReset}
            value={month}
            align="center"
            defaultValue={defaultValue}
            onChange={(evt, nextMonth) => {
                setMonth(nextMonth);
                onChange(evt, nextMonth);
            }}
            {...restProps}
            {...(restProps.renderInput instanceof Function
                ? { inputProps }
                : {
                      renderInput: (renderProps) => (
                          <MonthPickerDefaultInput
                              isClearMonth={!month}
                              inputProps={inputProps}
                              {...restProps}
                              {...renderProps}
                          />
                      ),
                  })}
        />
    );
}

OwpMonthPicker.defaultProps = {
    className: '',
    style: {},
    initNow: false,
    required: false,
    value: '',
    defaultValue: '',
    id: `owp-month-picker-${uniqueId()}`,
    name: 'owp-month-picker',
    label: '기준월',
    errorMessage: '',
    useKr: false,
    useClear: true,
    useReset: false,
    onChange: (event, value) => {},
};

export default OwpMonthPicker;

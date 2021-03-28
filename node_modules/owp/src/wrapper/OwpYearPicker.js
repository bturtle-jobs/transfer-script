import { Icon, IconButton, TextField } from '@material-ui/core';
import uniqueId from 'lodash/uniqueId';
import { makeNowYYYY } from 'owp/common';
import React, { useState } from 'react';
import OwpDateTimePicker from './OwpDateTimePicker';

function YearPickerDefaultInput({
    required,
    isClearYear,
    useClear,
    inputProps,
    InputProps,
    errorMessage,
    label,
    value,
    onClick,
    onFocus,
    onKeyDown,
    onChange,
} = {}) {
    return (
        <TextField
            required={required}
            label={label}
            value={isClearYear ? '' : value}
            error={!!errorMessage}
            helperText={errorMessage}
            onClick={onClick}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{ style: { textAlign: 'center', width: 120 }, ...inputProps }}
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
            onChange={(evt) => (evt.target.value = value)}
        />
    );
}
function OwpYearPicker({
    initNow,
    useReset,
    value,
    defaultValue,
    inputProps,
    onChange,
    ...restProps
}) {
    const [year, setYear] = useState(!value && initNow ? makeNowYYYY() : value);

    return (
        <OwpDateTimePicker
            useYear
            initNow={initNow}
            useReset={useReset}
            align="center"
            value={year}
            defaultValue={defaultValue}
            onChange={(evt, nextYear) => {
                setYear(nextYear);
                onChange(evt, nextYear);
            }}
            {...restProps}
            {...(restProps.renderInput instanceof Function
                ? { inputProps }
                : {
                      renderInput: (renderProps) => (
                          <YearPickerDefaultInput
                              isClearYear={!year}
                              inputProps={inputProps}
                              {...restProps}
                              {...renderProps}
                          />
                      ),
                  })}
        />
    );
}

OwpYearPicker.defaultProps = {
    className: '',
    id: `owp-year-picker-${uniqueId()}`,
    name: 'owp-year-picker',
    style: {},
    label: '기준연도',
    required: false,
    value: '',
    defaultValue: '',
    position: 'absolute',
    initNow: false,
    useReset: false,
    useClear: true,
    errorMessage: '',
    onChange: (event, value) => {},
};

export default OwpYearPicker;

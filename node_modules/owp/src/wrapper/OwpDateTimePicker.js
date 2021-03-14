import { Icon, IconButton, MenuItem, TextField } from '@material-ui/core';
import classNames from 'classnames';
import get from 'lodash/get';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';
import moment from 'moment';
import { DatePicker, DateTimePicker } from 'owp/components';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { connect } from 'react-redux';

const YEAR_FORMAT = 'YYYY';
const MONTH_FORMAT = 'YYYY-MM';
const DATE_FORMAT = 'YYYY-MM-DD';
const FULL_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

const INIT_ADDITIONAL_VALUE = '00';

const validDate = (useValidate) => (current) => {
    if (!useValidate) {
        return true;
    }

    return current.isBefore();
};

const makeDateStringByDateForamt = (date = '', dateFormat) => {
    if (date instanceof Date) {
        return moment(date).format(dateFormat);
    }

    if (date instanceof moment) {
        return date.format(dateFormat);
    }

    return date;
};

const initDatesByValues = (value = '', { initNow, dateFormat } = {}) => {
    if (initNow) {
        return {
            date: new Date(),
            additional: INIT_ADDITIONAL_VALUE,
        };
    }

    const convertedDate = makeDateStringByDateForamt(value, dateFormat);

    const dateFormatLength = dateFormat.length;

    const date = !!convertedDate
        ? new Date(convertedDate.substring(0, dateFormatLength))
        : convertedDate;
    const additional = !!convertedDate
        ? convertedDate.substring(dateFormatLength + 1, dateFormatLength + 3)
        : INIT_ADDITIONAL_VALUE;

    return {
        date,
        additional,
    };
};

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_DATE_ONLY':
            return { ...state, [action.key]: action.value };
        case 'UPDATE_DATE_AND_ADDITIONAL':
            return action.value;
        default:
            return state;
    }
}

function OwpDateTimePicker({
    className,
    initNow,
    required,
    fullWidth,
    fullDate,
    autoFocus,
    useYear,
    useMonth,
    useHour,
    useReset,
    useSecond,
    inputRef,
    inputProps,
    InputProps,
    useValidate,
    isReset,
    isSearch,
    label,
    value,
    defaultValue,
    onChange,
    ...restProps
}) {
    const _fullDate = fullDate || useSecond;
    const dateFormat = useYear
        ? YEAR_FORMAT
        : useMonth
        ? MONTH_FORMAT
        : _fullDate
        ? FULL_DATE_FORMAT
        : DATE_FORMAT;

    const _defaultValue = useRef(
        initDatesByValues(defaultValue || value, {
            initNow,
            dateFormat,
        })
    );

    const [dateTime, dispatch] = useReducer(reducer, _defaultValue.current);

    useEffect(() => {
        handleChange(dateTime);
    }, [dateTime]);

    useEffect(() => {
        if (useReset && isReset) {
            dispatch({
                type: 'UPDATE_DATE_AND_ADDITIONAL',
                value: initNow ? initDatesByValues('', { initNow }) : _defaultValue.current,
            });

            handleChange(_defaultValue.current);
        }
    }, [useReset, isReset]);

    const handleChange = ({ date = '', additional }) => {
        const changedEvent = new Event('change', {
            bubbles: true,
        });

        const dateValue =
            date instanceof moment
                ? date.format(dateFormat)
                : date instanceof Date
                ? moment(date).format(dateFormat)
                : date;
        const additionalValue =
            !!dateValue && !!additional
                ? `${
                      useHour && !useSecond
                          ? ` ${additional}:00:00`
                          : !useHour && useSecond
                          ? `:${additional}`
                          : ''
                  }`
                : '';

        Object.defineProperty(changedEvent, 'target', {
            writable: false,
            value: {
                name: restProps.name,
                value: `${dateValue}${additionalValue}`,
            },
        });

        onChange(changedEvent, `${dateValue}${additionalValue}`);
    };

    const handleSetDate = (key = 'date') => (value) => {
        dispatch({
            type: 'UPDATE_DATE_ONLY',
            key,
            value:
                value instanceof moment
                    ? value
                    : key === 'date' && !!value
                    ? new Date(value)
                    : value,
        });
    };

    return (
        <DateTimePicker
            className={classNames(className, { 'mr-20': isSearch })}
            isValidDate={validDate(useValidate)}
            dateFormat={dateFormat}
            value={dateTime.date}
            defaultValue={_defaultValue.current}
            onChange={handleSetDate()}
            renderInput={(renderProps) => (
                <DateTimeInput
                    required={required}
                    autoFocus={autoFocus}
                    dateFormatLength={dateFormat.length}
                    inputRef={inputRef}
                    fullDate={_fullDate}
                    useHour={useHour}
                    useSecond={useSecond}
                    isClearDate={!dateTime.date}
                    label={label}
                    additionalValue={dateTime.additional}
                    handleSetAdditionalValue={handleSetDate('additional')}
                    inputProps={inputProps}
                    /*eslint-disable-next-line*/
                    InputProps={InputProps}
                    {...restProps}
                    {...renderProps}
                    value={dateTime.date}
                />
            )}
            {...restProps}
        />
    );
}

function DateTimeInput({
    required,
    autoFocus,
    fullWidth,
    dateFormat,
    dateFormatLength,
    errorMessage,
    fullDate,
    useHour,
    useSecond,
    usePicker,
    useClear,
    isClearDate,
    align,
    label,
    value = '',
    additionalValue,
    inputRef,
    inputProps,
    InputProps,
    onFocus,
    onKeyDown,
    onChange,
    onClose,
    handleSetAdditionalValue,
    handleResetError,
    ...restProps
}) {
    const _value = useMemo(() => {
        const _value = makeDateStringByDateForamt(value, dateFormat);
        return typeof _value === 'string' ? _value.substring(0, dateFormatLength) : _value;
    }, [value]);

    const [date = '', setDate] = useState(_value);
    const dateRef = useRef(null);

    useEffect(() => {
        setDate(_value);
    }, [_value]);

    return (
        <div className="flex">
            <DatePicker
                className={classNames({
                    'w-224': fullDate && !useSecond,
                    'w-256': !fullDate && useHour,
                    'w-288': fullDate && useSecond,
                })}
                style={get(inputProps, 'style', {})}
                required={required}
                autoFocus={autoFocus}
                error={!!errorMessage}
                helperText={errorMessage}
                fullWidth={fullWidth}
                fullDate={fullDate}
                label={label}
                value={isClearDate ? '' : date.replace(/ /g, 'T')}
                onBlur={noop}
                onKeyDown={onKeyDown}
                onChange={(changedDate) => {
                    onChange({ target: { value: changedDate.replace(/T/g, ' ') } });
                    setDate(changedDate);
                }}
                inputRef={(ref) => {
                    if (!!get(inputRef, 'current')) {
                        inputRef.current = ref;
                    } else {
                        inputRef = ref;
                    }
                    dateRef.current = ref;
                }}
                inputProps={{
                    ...omit(inputProps, ['defaultValue']),
                    picker: 'disable',
                    spin: 'disable',
                    clear: 'disable',
                    className: classNames({
                        'text-left': align === 'left',
                        'text-center': align === 'center',
                        'text-right': align === 'right',
                    }),
                    onClick: usePicker ? noop : onFocus,
                }}
                /*eslint-disable-next-line*/
                InputProps={{
                    ...omit(InputProps, ['defaultValue']),
                    endAdornment: (
                        <>
                            {(useHour || useSecond) && (
                                <>
                                    <TextField
                                        select
                                        className="min-w-52 mr-12"
                                        value={additionalValue}
                                        error={!!errorMessage}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        inputProps={{
                                            className: 'min-w-48',
                                        }}
                                        /*eslint-disable-next-line*/
                                        InputProps={{
                                            disableUnderline: true,
                                        }}
                                        onChange={(evt) =>
                                            handleSetAdditionalValue(evt.target.value)
                                        }
                                    >
                                        {range(useHour ? 24 : 60).map((num) => (
                                            <MenuItem
                                                key={`option-hour-${num}`}
                                                value={num < 10 ? `0${num}` : num}
                                            >{`${num}${useHour ? '시' : '초'}`}</MenuItem>
                                        ))}
                                    </TextField>
                                </>
                            )}
                            {useClear && (
                                <IconButton
                                    disableRipple
                                    className="w-16 h-16 p-0"
                                    onClick={(_) => {
                                        onChange({ target: { value: '' } });
                                        setDate('');
                                        dateRef.current.value = '';
                                        handleSetAdditionalValue(INIT_ADDITIONAL_VALUE);
                                        handleResetError();
                                    }}
                                >
                                    <Icon className="text-14">clear</Icon>
                                </IconButton>
                            )}
                            {usePicker && (
                                <IconButton
                                    disableRipple
                                    className="w-16 h-16 p-0"
                                    onClick={onFocus}
                                >
                                    <Icon className="text-14">event</Icon>
                                </IconButton>
                            )}
                        </>
                    ),
                }}
            />
        </div>
    );
}

OwpDateTimePicker.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    initNow: PropTypes.bool,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
    fullDate: PropTypes.bool,
    autoFocus: PropTypes.bool,
    useYear: PropTypes.bool,
    useMonth: PropTypes.bool,
    useHour: PropTypes.bool,
    useSecond: PropTypes.bool,
    useValidate: PropTypes.bool,
    useClear: PropTypes.bool,
    usePicker: PropTypes.bool,
    useReset: PropTypes.bool,
    isReset: PropTypes.bool,
    isSearch: PropTypes.bool,
    inputRef: PropTypes.any,
    inputProps: PropTypes.object,
    InputProps: PropTypes.object,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
        PropTypes.instanceOf(Date),
    ]),
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
        PropTypes.instanceOf(Date),
    ]),
    handleResetError: PropTypes.func,
    errorMessage: PropTypes.string,
    onChange: PropTypes.func,
};

OwpDateTimePicker.defaultProps = {
    id: `owp-datetime-picker-${uniqueId()}`,
    name: 'owp-datetime-picker',
    className: '',
    initNow: false,
    required: false,
    fullWidth: false,
    fullDate: false,
    autoFocus: false,
    useYear: false,
    useMonth: false,
    useHour: false,
    useSecond: false,
    useClear: true,
    usePicker: true,
    useReset: false,
    useValidate: true,
    isSearch: false,
    isReset: false,
    inputRef: null,
    inputProps: {},
    InputProps: {},
    align: 'left',
    label: '기준일',
    value: '',
    defaultValue: '',
    errorMessage: '',
    handleResetError: () => {},
    onChange: (event, value) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default connect(mapStateToProps)(OwpDateTimePicker);

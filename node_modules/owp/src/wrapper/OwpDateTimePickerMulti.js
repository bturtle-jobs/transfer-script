import classNames from 'classnames';
import every from 'lodash/every';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import OwpDateTimePicker from './OwpDateTimePicker';

const DATE_KEYS = ['start', 'end'];
const DATES_LABELS_TXT_KR = ['시작일', '종료일'];

const START_NUM = 0;
const END_NUM = 1;

function OwpDateTimePickerMulti({
    id,
    name,
    className,
    required,
    fullDate,
    useHour,
    useSecond,
    usePicker,
    useClear,
    useReset,
    useForceChange,
    useValidate,
    useFilterSameDate,
    autoFocus,
    disableLabels,
    labels,
    defaultValues,
    values,
    errorMessages,
    position,
    initNow,
    isReset,
    isSearch,
    inputProps,
    InputProps,
    onChange,
}) {
    const useFullDate = fullDate || useSecond;
    const labelsData = DATES_LABELS_TXT_KR.map((label, index) =>
        get(labels, DATE_KEYS[index], label)
    );

    const [errors, setErrors] = useState({});
    const datesRef = range(2).map((_) => useRef(null));
    const handleChangeDates = useCallback(
        (isStart, key) => {
            const changedEvent = new Event('change', {
                bubbles: true,
            });

            if (every(datesRef.map(({ current }) => !current))) {
                setErrors({});
                Object.defineProperty(changedEvent, 'target', {
                    writable: false,
                    value: {
                        name,
                        value: '',
                    },
                });

                onChange(changedEvent, '');
                return;
            }

            const _labels = {
                [DATE_KEYS[START_NUM]]: labels.start || DATES_LABELS_TXT_KR[START_NUM],
                [DATE_KEYS[END_NUM]]: labels.end || DATES_LABELS_TXT_KR[END_NUM],
            };

            if (
                useValidate &&
                moment(datesRef[isStart ? START_NUM : END_NUM].current).isAfter(new Date())
            ) {
                setErrors({
                    ...errors,
                    [key]: get(
                        errorMessages,
                        `today.${DATE_KEYS[isStart ? START_NUM : END_NUM]}`,
                        `${
                            _labels[DATE_KEYS[isStart ? START_NUM : END_NUM]]
                        } 이 오늘보다 클 수 없습니다.`
                    ),
                });
                return;
            }

            if (!useForceChange && !every(datesRef.map(({ current }) => !!current))) {
                return;
            }

            if (
                useFilterSameDate &&
                moment(datesRef[START_NUM].current).isSame(datesRef[END_NUM].current)
            ) {
                setErrors({
                    ...errors,
                    [key]: get(
                        errorMessages,
                        `same.${DATE_KEYS[isStart ? START_NUM : END_NUM]}`,
                        `${_labels[DATE_KEYS[isStart ? START_NUM : END_NUM]]} 이 ${
                            _labels[DATE_KEYS[isStart ? END_NUM : START_NUM]]
                        } 과 같습니다.`
                    ),
                });
                return;
            }

            if (moment(datesRef[START_NUM].current).isAfter(datesRef[END_NUM].current)) {
                setErrors({
                    ...errors,
                    [key]: get(
                        errorMessages,
                        `diff.${DATE_KEYS[isStart ? START_NUM : END_NUM]}`,
                        isStart
                            ? `${_labels.start} 은 ${_labels.end} 보다 클 수 없습니다.`
                            : `${_labels.end} 은 ${_labels.start} 보다 커야 합니다.`
                    ),
                });
                return;
            }

            setErrors({});

            const changedDatesValue = datesRef.map(({ current }) => current).join(',');

            Object.defineProperty(changedEvent, 'target', {
                writable: false,
                value: {
                    name,
                    value: changedDatesValue,
                },
            });

            onChange(changedEvent, changedDatesValue);
        },
        [useValidate, useForceChange, datesRef, onChange]
    );

    return (
        <div className={classNames('flex', className)}>
            {DATE_KEYS.map((key, index) => {
                const isStart = index === 0;

                const defaultValue = get(defaultValues, key);

                return (
                    <OwpDateTimePicker
                        key={`${name}-item-${index}`}
                        initNow={initNow}
                        className={classNames(
                            { 'mr-12': isStart, 'mr-20': !isStart && isSearch },
                            className
                        )}
                        position={position}
                        required={required}
                        autoFocus={autoFocus && isStart}
                        fullDate={useFullDate}
                        useValidate={useValidate}
                        useHour={useHour}
                        useSecond={useSecond}
                        usePicker={usePicker}
                        useClear={useClear}
                        useReset={useReset}
                        label={disableLabels ? null : get(labelsData, index)}
                        defaultValue={
                            isEmpty(defaultValue)
                                ? get(inputProps, `${key}["defaultValue"]`, '')
                                : defaultValue
                        }
                        value={get(values, key, get(inputProps, `${key}["value"]`))}
                        errorMessage={get(errors, key)}
                        inputProps={get(inputProps, key)}
                        onChange={(_, date) => {
                            if ((useReset && isReset) || datesRef[index].current !== date) {
                                datesRef[index].current = date;
                                handleChangeDates(isStart, key);
                            }
                        }}
                        handleResetError={() =>
                            setErrors({
                                ...errors,
                                [key]: '',
                            })
                        }
                        /*eslint-disable-next-line*/
                        InputProps={get(InputProps, key)}
                    />
                );
            })}
        </div>
    );
}

OwpDateTimePickerMulti.defaultProps = {
    id: `owp-date-time-picker-multi-${uniqueId()}`,
    name: `owp-date-time-picker-multi`,
    className: '',
    required: false,
    fullDate: false,
    autoFocus: false,
    autoMove: false,
    initNow: false,
    isSearch: false,
    useHour: false,
    useForceChange: true,
    useValidate: true,
    useSecond: false,
    usePicker: true,
    useClear: true,
    useReset: false,
    useFilterSameDate: false,
    position: 'absolute',
    disableLabels: false,
    defaultValues: {
        start: '',
        end: '',
    },
    values: {
        start: '',
        end: '',
    },
    labels: {
        start: '시작일',
        end: '종료일',
    },
    errorMessages: {
        today: {
            start: undefined,
            end: undefined,
        },
        same: {
            start: undefined,
            end: undefined,
        },
        diff: {
            start: undefined,
            end: undefined,
        },
    },
    inputProps: {
        start: {},
        end: {},
    },
    InputProps: {
        start: {},
        end: {},
    },
    onChange: (event, value) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default connect(mapStateToProps)(OwpDateTimePickerMulti);

import classNames from 'classnames';
import every from 'lodash/every';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import uniqueId from 'lodash/uniqueId';
import moment from 'moment';
import { makeNowYYYYMM } from 'owp/common';
import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import OwpMonthPicker from './OwpMonthPicker';

const START_NUM = 0;
const END_NUM = 1;

const MONTH_KEYS = ['start', 'end'];
const MONTH_LABELS_TXT_KR = ['시작월', '종료월'];

function OwpMonthPickerMulti({
    className,
    name,
    initNow,
    useReset,
    useFilterSameMonth,
    labels,
    values,
    defaultValues,
    inputProps,
    InputProps,
    isReset,
    onChange,
}) {
    const labelsData = MONTH_LABELS_TXT_KR.map((label, i) => get(labels, MONTH_KEYS[i], label));

    const [errors, setErrors] = useState({});
    const monthsRef = range(2).map((_) => useRef(makeNowYYYYMM()));
    const handleChangeMonths = useCallback(
        (isStart, key) => {
            const changedEvent = new Event('change', {
                bubbles: true,
            });

            if (every(monthsRef.map(({ current }) => !current))) {
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

            if (!every(monthsRef.map(({ current }) => !!current))) {
                return;
            }

            if (
                useFilterSameMonth &&
                moment(monthsRef[START_NUM].current).isSame(monthsRef[END_NUM].current)
            ) {
                setErrors({
                    ...errors,
                    [key]: `${labels[MONTH_KEYS[isStart ? START_NUM : END_NUM]]} 이 ${
                        labels[MONTH_KEYS[isStart ? END_NUM : START_NUM]]
                    } 과 같습니다.`,
                });
                return;
            }

            if (moment(monthsRef[START_NUM].current).isAfter(monthsRef[END_NUM].current)) {
                setErrors({
                    ...errors,
                    [key]: isStart
                        ? `${labels.start} 은 ${labels.end} 보다 클수 없습니다.`
                        : `${labels.end} 은 ${labels.start} 보다 커야 합니다.`,
                });
                return;
            }

            setErrors({});

            const changedDatesValue = monthsRef.map(({ current }) => current).join(',');

            Object.defineProperty(changedEvent, 'target', {
                writable: false,
                value: {
                    name,
                    value: changedDatesValue,
                },
            });

            onChange(changedEvent, changedDatesValue);
        },
        [monthsRef]
    );

    return (
        <div className={classNames('flex', className)}>
            {MONTH_KEYS.map((key, index) => {
                const isStart = index === START_NUM;

                const defaultValue = get(defaultValues, key);

                return (
                    <OwpMonthPicker
                        className={classNames({ 'mr-12': isStart, 'mr-20': !isStart })}
                        key={`owp-month-picker-multi-item-${index}`}
                        initNow={initNow}
                        useReset={useReset}
                        label={get(labelsData, index)}
                        defaultValue={
                            isEmpty(defaultValue)
                                ? get(inputProps, `${key}["defaultValue"]`, '')
                                : defaultValue
                        }
                        value={get(values, key, get(inputProps, `${key}["value"]`))}
                        errorMessage={get(errors, MONTH_KEYS[index], '')}
                        inputProps={get(inputProps, key)}
                        /*eslint-disable-next-line*/
                        InputProps={get(InputProps, key)}
                        onChange={(_, date) => {
                            if ((useReset && isReset) || monthsRef[index].current !== date) {
                                monthsRef[index].current = date;
                                handleChangeMonths(isStart, key);
                            }
                        }}
                    />
                );
            })}
        </div>
    );
}

OwpMonthPickerMulti.defaultProps = {
    id: `owp-month-picker-multi-${uniqueId()}`,
    name: `owp-month-picker-multi`,
    className: '',
    initNow: false,
    useReset: false,
    useFilterSameMonth: false,
    defaultValues: {
        start: '',
        end: '',
    },
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
    onChange: (event, value) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default connect(mapStateToProps)(OwpMonthPickerMulti);

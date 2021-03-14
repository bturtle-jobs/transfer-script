import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isEqual from 'date-fns/isEqual';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import range from 'lodash/range';
import { makeNowYYYYMMDD, makeNowYYYYMMDDHHmm } from 'owp/common';
import { DatePicker } from 'owp/components';
import { depr } from 'owp/debug';
import * as Actions from 'owp/store/actions/owp';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const START = 0;
const END = 1;
const LABEL_KEYS = ['start', 'end'];

const _debounce = debounce((func = noop) => func(), 100);

const initAdditionalDateValues = Object.fromEntries(range(2).map((num) => [num, '00']));

const OwpDatePickerMulti = ({
    id,
    name,
    fullWidth,
    fullDate,
    autoFocus,
    initNow,
    useHour,
    useSecond,
    useFilterSameDate,
    labels,
    onChange,
    callback,
    autoMove,
    startDateProps,
    endDateProps,
    isReset,
    resetAutoComplate,
    className,
    ...restProps
}) => {
    const [helperTextData, setHelperText] = useState({});
    const [addtionalDateValue, setAddtionalDate] = useState(initAdditionalDateValues);
    const [defaultDates, setDefaultDates] = useState([]);
    const [stopMoveNextItem, setStopMoveNextItem] = useState({});

    const useFullDate = fullDate || useSecond;

    const datesInstance = [useRef(null), useRef(null)];

    useEffect(() => {
        depr(
            '[OwpDatePickerMulti]: `OwpDatePickerMulti or OwpSearchDatePickerMulti` 는 deprecate 되었습니다. `OwpDateTimePickerMulti or OwpSearchDateTimePickerMulti` 으로 사용 하세요.'
        );

        if (isEmpty(defaultDates)) {
            if (initNow) {
                setDefaultDates(range(2).map(() => getNow()));
                return;
            }
            setDefaultDates(
                [startDateProps, endDateProps].map(({ defaultValue = '' } = {}) => defaultValue)
            );
        }
    }, []);

    useEffect(() => {
        if (isReset) {
            range(2).map((num) =>
                ['value', 'defaultValue'].forEach(
                    (key) => (datesInstance[num].current[key] = get(defaultDates, num, ''))
                )
            );

            setHelperText({});
            setStopMoveNextItem({});
            setAddtionalDate(initAdditionalDateValues);
            resetAutoComplate(false);
        }
    }, [isReset]);

    const getNow = () => (useFullDate ? makeNowYYYYMMDDHHmm('-', ':') : makeNowYYYYMMDD('-'));

    const getAdditionalTargetValue = ({ index, value } = {}) => get(value, index, '00');

    const makeDateProps = ({ defaultValue, inputProps, ...restProps } = {}, index = 0) => {
        return {
            inputProps: {
                ...(useFullDate && { style: { minWidth: 240 } }),
                ...inputProps,
            },
            defaultValue: initNow ? getNow() : defaultValue,
            InputProps: {
                inputProps: {
                    max: getNow(),
                    onKeyDown: (evt) => {
                        if (!!/^\d+$/.test(evt.key) && !stopMoveNextItem[index]) {
                            setStopMoveNextItem({ ...stopMoveNextItem, [index]: true });
                        }
                    },
                    onBlur: () =>
                        stopMoveNextItem[index] &&
                        setStopMoveNextItem({ ...stopMoveNextItem, [index]: false }),
                },
            },
            ...restProps,
        };
    };

    const moveNextItem = (isStart) => {
        if (!useHour && !useSecond && autoMove) {
            if (isStart && !stopMoveNextItem[START]) {
                _debounce(() => datesInstance[END].current.focus());
                return;
            }

            if (!isStart && !stopMoveNextItem[END] && !datesInstance[START].current.value) {
                _debounce(() => datesInstance[START].current.focus());
                return;
            }
        }
    };

    const handleChange = ({ isStart, nextAddtionalDateValue }, index) => {
        if (!!nextAddtionalDateValue) {
            setAddtionalDate(nextAddtionalDateValue);
        }

        const [startDate, endDate] = range(2).map(
            (num) =>
                !isEmpty(datesInstance[num].current.value) &&
                new Date(datesInstance[num].current.value)
        );

        if (!!startDate && !!endDate) {
            if (
                (isStart && isAfter(startDate, endDate)) ||
                (!isStart && isBefore(endDate, startDate)) ||
                ((useHour || useSecond) &&
                    isEqual(startDate, endDate) &&
                    parseInt(get(nextAddtionalDateValue || addtionalDateValue, START)) >
                        parseInt(get(nextAddtionalDateValue || addtionalDateValue, END)))
            ) {
                setHelperText({
                    ...helperTextData,
                    [index]: isStart
                        ? `${labels.start} 은 ${labels.end} 보다 클수 없습니다.`
                        : `${labels.end} 은 ${labels.start} 보다 커야 합니다.`,
                });

                return;
            }

            if (useFilterSameDate && isEqual(startDate, endDate)) {
                setHelperText({
                    ...helperTextData,
                    [index]: `${labels[LABEL_KEYS[isStart ? START : END]]} 이 ${
                        labels[LABEL_KEYS[isStart ? END : START]]
                    } 과 같습니다.`,
                });

                return;
            }

            //success
            // TODO: hour or second 사용시.. next focus 적용 필요
            moveNextItem(isStart);
            setHelperText({});
        }

        const changedDatesValue = range(2)
            .map((num) => {
                const dateTime = get(datesInstance, `${[num]}.current.value`, '');
                return `${
                    useFullDate
                        ? useSecond
                            ? `${dateTime.replace(/T/, ' ')}:${getAdditionalTargetValue({
                                  index: num,
                                  value: nextAddtionalDateValue || addtionalDateValue,
                              })}`
                            : dateTime.replace(/T/, ' ')
                        : dateTime
                }${
                    useHour
                        ? `-${getAdditionalTargetValue({
                              index: num,
                              value: nextAddtionalDateValue || addtionalDateValue,
                          })}`
                        : ''
                }`;
            })
            .join();

        onChange(name, changedDatesValue);

        if (typeof callback === 'function') {
            depr(
                '[OwpDatePickerMulti]: `callback(name, dates)` prop은 deprecate 되었습니다. `onChange(name, dates)` prop을 사용 바랍니다..'
            );

            callback(name, changedDatesValue);
        }
    };

    return (
        <div className={classNames('flex', className)}>
            {range(2).map((rootNum) => {
                const isStart = rootNum === START;
                const helperText = helperTextData[rootNum];
                return (
                    <div
                        className={classNames({ 'mr-12': isStart, 'mr-20': !isStart })}
                        key={`${id}-${rootNum}`}
                    >
                        <DatePicker
                            {...makeDateProps(
                                isStart ? startDateProps : endDateProps,

                                rootNum
                            )}
                            autoFocus={isStart && autoFocus}
                            error={!!helperText}
                            helperText={helperText}
                            fullWidth={fullWidth}
                            fullDate={useFullDate}
                            label={labels[LABEL_KEYS[isStart ? START : END]]}
                            inputRef={datesInstance[isStart ? START : END]}
                            onChange={() => handleChange({ isStart }, rootNum)}
                        />
                        {!fullDate && (useHour || useSecond) && (
                            <TextField
                                select
                                className="mt-16"
                                value={get(addtionalDateValue, rootNum, '00')}
                                error={!!helperText}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(evt) =>
                                    handleChange(
                                        {
                                            isStart,
                                            nextAddtionalDateValue: {
                                                ...addtionalDateValue,
                                                [rootNum]: evt.target.value,
                                            },
                                        },
                                        rootNum
                                    )
                                }
                            >
                                {range(useHour ? 24 : 60).map((subNum) => (
                                    <MenuItem
                                        key={`option-hour-${rootNum}-${subNum}`}
                                        value={subNum < 10 ? `0${subNum}` : subNum}
                                    >{`${subNum}${useHour ? '시' : '초'}`}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

OwpDatePickerMulti.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    /**
     * onChange return value => 'YYYY-MM-DD HH:mm'
     */
    fullDate: PropTypes.bool,
    /**
     * 시작 종료일이 같은 경우 Filter 설정 * true: 시작/종료 같음 Filter 함, flase: 시작/종료 같음 Filter 안함
     */
    useFilterSameDate: PropTypes.bool,
    /**
     * Start -> End date 자동 이동 여부
     */
    autoMove: PropTypes.bool,
    autoFocus: PropTypes.bool,
    /**
     * defaultValue 를 오늘날짜로 init
     */
    initNow: PropTypes.bool,
    /**
     * 시간(Hour) 설정 추가 * fullDate: true 인 경우 무시됨. * onChange return value => 'YYYY-MM-DD-HH'
     */
    useHour: PropTypes.bool,
    /**
     * 초(Second) 설정 추가 * onChange return value => 'YYYY-MM-DD HH:mm:ss'
     */
    useSecond: PropTypes.bool,
    /**
     * label 을 설정한다.
     * @param Object { start: 'start', end: 'end' }
     */
    labels: PropTypes.object,
    /**
     * 시작일 component props
     */
    startDateProps: PropTypes.object,
    /**
     * 종료일 component props
     */
    endDateProps: PropTypes.object,
    /**
     * 시작/종료 날짜 입력 완료 또는 선택 시 변경된 dates 전달
     *
     * @param (name, dateString) ex) name, 'YYYY-MM-DD...,YYYY-MM-DD...' // start date, end date
     */
    onChange: PropTypes.func,
    /**
     * [DPERICATE] 시작/종료 날짜 입력 완료 또는 선택 시 변경된 dates 전달
     *
     * @param (name, dateString) ex) name, 'YYYY-MM-DD...,YYYY-MM-DD...' // start date, end date
     */
    callback: PropTypes.func,
};

OwpDatePickerMulti.defaultProps = {
    id: 'OWP_DATES',
    fullWidth: false,
    fullDate: false,
    autoFocus: false,
    autoMove: false,
    initNow: false,
    useHour: false,
    useSecond: false,
    useFilterSameDate: false,
    labels: {
        start: '시작일',
        end: '종료일',
    },
    startDateProps: {},
    endDateProps: {},
    onChange: (dates) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            resetAutoComplate: Actions.resetAutoComplate,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(OwpDatePickerMulti);

import { TextField } from '@material-ui/core';
import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import React from 'react';

const DatePicker = ({ id, fullDate, inputProps, onChange, ...restProps }) => {
    return (
        <TextField
            InputLabelProps={{
                shrink: true,
            }}
            {...restProps}
            type={fullDate ? 'datetime-local' : 'date'}
            inputProps={{
                max: '2999-12-31',
                // pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
                id: uniqueId(`${id}-`),
                ...inputProps,
            }}
            onChange={(evt) => onChange(evt.target.value, evt)}
        />
    );
};

DatePicker.propTypes = {
    id: PropTypes.string.isRequired,
    fullDate: PropTypes.bool,
    /**
     * label
     */
    label: PropTypes.string,
    inputProps: PropTypes.object,
    /**
     * 날짜 입력 완료 또는 선택시 실행
     *
     * @param String ex) "2019-04-10"
     * @param Event ex) event object
     */
    onChange: PropTypes.func,
};

DatePicker.defaultProps = {
    id: 'owp-date-picker',
    fullDate: false,
    label: 'YYYY-MM-DD',
    inputProps: {},
    onChange: (date, evt) => {},
};

export default DatePicker;

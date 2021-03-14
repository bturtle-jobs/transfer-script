import classNames from 'classnames';
import 'moment/locale/ko';
import PropTypes from 'prop-types';
import React from 'react';
import Datetime from 'react-datetime';
import './DateTimePicker.css';

function DateTimePicker({ closeOnSelect, timeFormat, pickerSize, className, ...restProps }) {
    return (
        <Datetime
            closeOnSelect={closeOnSelect}
            timeFormat={timeFormat}
            className={classNames('owp-rdt-custom', className, {
                [`owp-rdt-size--${pickerSize}`]: !!pickerSize,
            })}
            {...restProps}
        />
    );
}

DateTimePicker.propTypes = {
    closeOnSelect: PropTypes.bool,
    timeFormat: PropTypes.bool,
    pickerSize: PropTypes.oneOf(['sm']),
    className: PropTypes.string,
};

DateTimePicker.defaultProps = {
    closeOnSelect: true,
    timeFormat: false,
};

export default DateTimePicker;

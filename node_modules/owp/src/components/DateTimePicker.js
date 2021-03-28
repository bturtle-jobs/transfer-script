import classNames from 'classnames';
import 'moment/locale/ko';
import PropTypes from 'prop-types';
import React from 'react';
import Datetime from 'react-datetime';
import './DateTimePicker.css';

function DateTimePicker({
    closeOnSelect,
    timeFormat,
    pickerSize,
    className,
    position,
    ...restProps
}) {
    return (
        <Datetime
            closeOnSelect={closeOnSelect}
            timeFormat={timeFormat}
            className={classNames('owp-rdt-custom', className, {
                [`owp-rdt-size--${pickerSize}`]: !!pickerSize,
                [`owp-rdt-picker--${position}`]: !!position,
            })}
            {...restProps}
        />
    );
}

DateTimePicker.propTypes = {
    closeOnSelect: PropTypes.bool,
    timeFormat: PropTypes.bool,
    useFixed: PropTypes.bool,
    pickerSize: PropTypes.oneOf(['sm']),
    position: PropTypes.oneOf(['fixed', 'absolute']),
    className: PropTypes.string,
};

DateTimePicker.defaultProps = {
    closeOnSelect: true,
    timeFormat: false,
    position: 'absolute',
};

export default DateTimePicker;

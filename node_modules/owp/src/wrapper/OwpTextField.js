import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import omit from 'lodash/omit';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

const useStyles = (width) =>
    makeStyles({
        withTable: {
            backgroundColor: '#f3f3f3',
            padding: '8px 3px 3px 6px',
            height: '45px',
            width,
        },
    })();

const OwpTextField = ({
    className = '',
    type,
    width,
    withTable,
    value,
    defaultValue,
    useReset,
    isReset,
    isSearch,
    InputProps,
    setValue,
    onChange,
    ...restProps
}) => {
    const classes = useStyles(width);
    const initValueRef = useRef(defaultValue || value);
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        if (useReset && isReset) {
            setValue(initValueRef.current);
            setInputValue(initValueRef.current);
        }
    }, [useReset, isReset]);

    useEffect(() => {
        if (!isReset) {
            setValue(value);
            setInputValue(value);
        }
    }, [isReset, value]);

    return (
        <TextField
            {...omit(restProps, ['dispatch'])}
            value={inputValue}
            type={type}
            autoComplete="off"
            InputProps={{
                ...InputProps,
                classes: {
                    root: classNames(
                        className,
                        InputProps.classes,
                        withTable && classes.withTable,
                        {
                            'mr-20': isSearch,
                        }
                    ),
                },
                ...(withTable && { disableUnderline: true }),
            }}
            InputLabelProps={{
                shrink: true,
            }}
            onChange={(evt) => {
                setInputValue(evt.target.value);
                onChange(evt, evt.target.value);
            }}
        />
    );
};

OwpTextField.defaultProps = {
    className: '',
    name: 'owp-textfield',
    useReset: false,
    isReset: false,
    isSearch: false,
    withTable: false,
    width: '100%',
    value: '',
    defaultValue: '',
    InputProps: {},
    type: 'text',
    setValue: () => {},
    onChange: () => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default connect(mapStateToProps)(OwpTextField);

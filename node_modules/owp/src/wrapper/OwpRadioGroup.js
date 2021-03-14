import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    withStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import { get, isEmpty, pick } from 'lodash';
import { depr } from 'owp/debug';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const styles = {
    formLabel: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left',
    },
    radioGroup: {
        marginTop: '-1.2rem',
        marginBottom: '-1.2rem',
    },
};

function OwpRadioGroup({
    className,
    name,
    classes,
    required,
    disabled,
    isSearch,
    isRow,
    isReset,
    useReset,
    color,
    errorMessage,
    label,
    optionLabelPlacement,
    defaultValue,
    value,
    onChange,
    ...restProps
}) {
    const options = isEmpty(get(restProps, 'options'))
        ? get(restProps, 'items', [])
        : get(restProps, 'options');
    const [currentValue, setValue] = useState((defaultValue || value).toString());

    useEffect(() => {
        if (!isEmpty(restProps.items)) {
            depr(
                '[OwpRadioGroup]: `items` prop은 deprecate 되었습니다. `options` prop을 사용 바랍니다.'
            );
        }

        if (!!restProps.itemLabelPlacement) {
            depr(
                '[OwpRadioGroup]: `itemLabelPlacement` prop은 deprecate 되었습니다. `optionLabelPlacement` prop을 사용 바랍니다.'
            );
        }
    }, []);

    useEffect(() => {
        if (useReset && isReset) {
            const changedEvent = new Event('change', {
                bubbles: true,
            });

            Object.defineProperty(changedEvent, 'target', {
                writable: false,
                value: {
                    name: name,
                    value: defaultValue.toString(),
                },
            });

            handleChange(changedEvent, changedEvent.target.value);
        }
    }, [useReset, isReset]);

    const handleChange = (evt, changedValue) => {
        if (onChange instanceof Function) {
            onChange(evt, changedValue);
        }

        setValue(changedValue);
    };

    if (isEmpty(options)) {
        console.error(
            '`options` prop은 필수 입니다. ex) `options={[{ label: l, value: v }, ...]}`'
        );

        return null;
    }

    const radioGroupProps = pick(restProps, ['onBlur', 'onKeyDown', 'variant', 'row']);

    return (
        <FormControl
            disabled={disabled}
            required={required}
            classes={{
                root: classNames(className, { 'mr-20': isSearch }),
            }}
            error={Boolean(errorMessage)}
        >
            {label && <FormLabel classes={{ root: classes.formLabel }}>{label}</FormLabel>}
            <RadioGroup
                {...radioGroupProps}
                name={name}
                classes={
                    isRow
                        ? { row: classNames(!!label && classes.radioGroup, !label && 'mt-8') }
                        : {}
                }
                value={currentValue}
                row={isRow}
                onChange={handleChange}
            >
                {options.map((option = { label: '', value: '' }, index) => (
                    <FormControlLabel
                        key={`owp-radio-${index}`}
                        value={
                            option.value instanceof String ? option.value : option.value.toString()
                        }
                        control={<Radio color={color} required={required} />}
                        label={option.label}
                        labelPlacement={optionLabelPlacement || restProps.itemLabelPlacement}
                    />
                ))}
            </RadioGroup>
            {Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
}

OwpRadioGroup.defaultProps = {
    className: '',
    name: 'owp-radio-group',
    label: '',
    defaultValue: '',
    value: '',
    options: [],
    color: 'primary',
    optionLabelPlacement: 'end',
    errorMessage: '',
    required: false,
    disabled: false,
    useReset: false,
    isReset: false,
    isSearch: false,
    isRow: true,
    onChange: (event, value) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default withStyles(styles)(connect(mapStateToProps)(OwpRadioGroup));

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    withStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import { get, isArray, isEmpty, isString, noop, pick } from 'lodash';
import { depr } from 'owp/debug';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

const styles = {
    formLabel: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left',
    },
    formGroup: {
        marginTop: '-1.2rem',
        marginBottom: '-1.2rem',
    },
    formControlLabel: {
        marginTop: '-1.2rem',
        marginBottom: '-0.6rem',
    },
};

function OwpCheckBox({
    className,
    name,
    classes,
    isSearch,
    isReset,
    isRow,
    useReset,
    required,
    disabled,
    errorMessage,
    label,
    optionLabel,
    optionLabelPlacement,
    onChange,
    ...restProps
}) {
    const options = isEmpty(get(restProps, 'options'))
        ? get(restProps, 'items', [])
        : get(restProps, 'options');
    const isEmptyOptionsProp = isEmpty(options);
    const defaultValue = isEmptyOptionsProp
        ? restProps.defaultValue
        : isString(restProps.defaultValue)
        ? restProps.defaultValue.split(',')
        : isArray(restProps.defaultValue)
        ? restProps.defaultValue
        : [];

    const [value, setValue] = useState(
        isArray(defaultValue) ? defaultValue.map((v) => v.toString()) : defaultValue
    );

    const inputRef = useRef(null);

    useEffect(() => {
        if (!isEmptyOptionsProp && required && !isEmpty(defaultValue)) {
            inputRef.current.value = defaultValue.join(',');
            inputRef.current.setCustomValidity('');
        }

        if (!isEmpty(restProps.items)) {
            depr(
                '[OwpCheckBox]: `items` prop은 deprecate 되었습니다. `options` prop을 사용 바랍니다.'
            );
        }

        if (!!restProps.itemLabel) {
            depr(
                '[OwpCheckBox]: `itemLabel` prop은 deprecate 되었습니다. `optionLabel` prop을 사용 바랍니다.'
            );
        }

        if (!!restProps.itemLabelPlacement) {
            depr(
                '[OwpCheckBox]: `itemLabelPlacement` prop은 deprecate 되었습니다. `optionLabelPlacement` prop을 사용 바랍니다.'
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
                    name: restProps.name,
                    value: defaultValue,
                    ...(isEmptyOptionsProp && { checked: defaultValue }),
                },
            });

            handleChange(changedEvent);
        }
    }, [useReset, isReset]);

    const handleChange = (evt) => {
        if (isEmptyOptionsProp) {
            if (onChange instanceof Function) {
                onChange(evt, evt.target.checked);
            }
            setValue(evt.target.checked);
            return;
        }

        const changedValue = isReset
            ? evt.target.value
            : evt.target.checked
            ? [...value, evt.target.value.toString()]
            : value.filter((v) => v !== evt.target.value);
        const changedValueStr = changedValue.join(',');

        if (onChange instanceof Function) {
            const changedEvent = new Event('change', {
                bubbles: true,
            });

            Object.defineProperty(changedEvent, 'target', {
                writable: false,
                value: {
                    name: restProps.name,
                    value: changedValueStr,
                },
            });

            onChange(changedEvent, changedValueStr);
        }

        if (!isEmptyOptionsProp && required) {
            inputRef.current.value = changedValueStr;
            !isEmpty(changedValue) && inputRef.current.setCustomValidity('');
        }

        setValue(changedValue);
    };

    const checkboxProps = pick(restProps, [
        'checkedIcon',
        'color',
        'disableRipple',
        'icon',
        'id',
        'indeterminate',
        'indeterminateIcon',
        'inputProps',
        'inputRef',
        'variant',
    ]);

    return (
        <FormControl
            disabled={disabled}
            required={!isEmptyOptionsProp && required}
            name={name}
            error={Boolean(errorMessage)}
            className={classNames(className, { 'mr-20': isSearch })}
        >
            {label && <FormLabel classes={{ root: classes.formLabel }}>{label}</FormLabel>}
            {isEmptyOptionsProp ? (
                <FormControlLabel
                    classes={{ root: classNames(classes.formControlLabel, !label && 'mt-8') }}
                    control={
                        <Checkbox
                            {...checkboxProps}
                            type="checkbox"
                            checked={value}
                            onChange={handleChange}
                        />
                    }
                    label={optionLabel || restProps.itemLabel}
                    labelPlacement={optionLabelPlacement || restProps.itemLabelPlacement}
                />
            ) : (
                <FormGroup
                    row={isRow}
                    classes={
                        isRow
                            ? { row: classNames(!!label && classes.formGroup, !label && 'mt-8') }
                            : {}
                    }
                >
                    {options.map(
                        (option = { label: '', value: '', labelPlacement: 'end' }, index) => {
                            return (
                                <FormControlLabel
                                    key={`checkbox-option-${index}`}
                                    control={
                                        <Checkbox
                                            {...checkboxProps}
                                            type="checkbox"
                                            name={option.label}
                                            value={option.value.toString()}
                                            checked={value.includes(option.value.toString())}
                                            onChange={handleChange}
                                        />
                                    }
                                    label={option.label}
                                    labelPlacement={
                                        !option.labelPlacement ? 'end' : option.labelPlacement
                                    }
                                />
                            );
                        }
                    )}
                </FormGroup>
            )}
            {!isEmptyOptionsProp && required && (
                <input
                    ref={inputRef}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, height: 0 }}
                    value={get(inputRef.current, 'value', '')}
                    onChange={noop}
                    onInvalid={(e) => {
                        e.target.setCustomValidity('다음 옵션 중 1개이상 선택하세요.');
                    }}
                    required={required}
                />
            )}
            {Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
}

OwpCheckBox.defaultProps = {
    className: '',
    name: 'owp-checkbox',
    label: '',
    optionLabel: '',
    optionLabelPlacement: 'end',
    options: [],
    required: false,
    disabled: false,
    defaultValue: [],
    value: false,
    useReset: false,
    isReset: false,
    isSearch: false,
    isRow: true,
    errorMessage: '',
    onChange: (event) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default withStyles(styles)(connect(mapStateToProps)(OwpCheckBox));

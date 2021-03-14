import {
    Checkbox,
    FilledInput,
    FormControl,
    FormHelperText,
    Input,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { get, isEmpty, isEqual, join, noop, pick, toString } from 'lodash';
import { query } from 'owp/api';
import { depr } from 'owp/debug';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';

const SELECTED_ALL = 'SELECTED_ALL';
const VALUE_ALL = '@@@@@@';
const VALUE_ALL_TEXT = '전체';

const styles = () => ({
    menuItem: {
        justifyContent: 'center',
    },
});
function usePreviousValue(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function makeEvent(name, value) {
    const changedEvent = new Event('change', {
        bubbles: true,
    });

    Object.defineProperty(changedEvent, 'target', {
        writable: false,
        value: {
            name,
            value,
        },
    });

    return changedEvent;
}

function OwpSelectField({
    className,
    classes,
    name,
    label,
    isMulti,
    required,
    useAll,
    useCheckboxMenuWithMenu,
    useReset,
    isSearch,
    isReset,
    disabled,
    groupId,
    commonCodes,
    query: queryOptions,
    mapper,
    items,
    options,
    defaultValue,
    value,
    removeDefaultOption,
    emptyOptionLabel,
    errorMessage,
    onChange,
    ...restProps
}) {
    const useAllSingle = !isMulti && useAll;
    const useAllMulti = isMulti && useAll;

    const [currentValue, setValue] = useState(useAllSingle ? VALUE_ALL : defaultValue || value);
    const [currentOptions, setOptions] = useState([]);
    const [currentOptionsConvToObj, setOptionsConvToObj] = useState({});

    const defaultValueRef = useRef(
        useAllSingle ? VALUE_ALL : useAllMulti ? null : defaultValue || value
    );
    const selectRef = useRef(null);
    const inputRef = useRef(null);

    const prevQueryOptions = usePreviousValue(queryOptions);
    const prevValue = usePreviousValue(value) || '';

    const selectedValue = useMemo(() => {
        return isMulti
            ? isEmpty(currentValue)
                ? []
                : typeof currentValue === 'string'
                ? currentValue.indexOf(',') === -1
                    ? [currentValue]
                    : currentValue.split(',')
                : currentValue
            : currentValue;
    }, [currentValue]);

    const useSelectedAll = useMemo(() => {
        if (useAllMulti) {
            return selectedValue.length === currentOptions.length;
        }

        return false;
    }, [useAllMulti, selectedValue, currentOptions]);

    useEffect(() => {
        if (required && useAllSingle) {
            inputRef.current.value = VALUE_ALL;
            inputRef.current.setCustomValidity('');
        }
    }, []);

    useEffect(() => {
        if (!isSearch && !isEqual(prevValue, value)) {
            setValue(value);
        }
    }, [isSearch, prevValue, value]);

    useEffect(() => {
        try {
            if (!isEmpty(items) && !isEqual(currentOptions, items)) {
                depr(
                    '[OwpSelectField]: `items` prop은 deprecate 되었습니다. `options` prop을 사용 바랍니다.'
                );
                setOptions(items);
                return;
            }

            if (!isEmpty(options) && !isEqual(currentOptions, options)) {
                setOptions(options);
            }
        } catch (error) {
            console.error(error);
        }
    }, [items, options]);

    useEffect(() => {
        if (!!groupId && !isEmpty(commonCodes) && isEmpty(currentOptions)) {
            setOptions(commonCodes[groupId]);
        }
    }, [commonCodes]);

    useEffect(() => {
        if (!isEmpty(get(queryOptions, 'url')) && !isEqual(prevQueryOptions, queryOptions)) {
            query(queryOptions)
                .then((data = []) =>
                    setOptions(
                        data.map((item) => ({
                            label: item[get(mapper, 'label', 'label')],
                            value: toString(item[toString(get(mapper, 'value', 'value'))] || ''),
                            data: item,
                        }))
                    )
                )
                .catch((error) => console.error(error));
        }
    }, [queryOptions, prevQueryOptions]);

    useEffect(() => {
        if (useReset && isReset) {
            handleChange(makeEvent(name, defaultValueRef.current));
        }
    }, [useReset, isReset]);

    useEffect(() => {
        if (useAllMulti && !isEmpty(currentOptions) && isEmpty(defaultValueRef.current)) {
            const values = currentOptions.map(({ value }) => value);
            defaultValueRef.current = values;
            setValue(values);

            if (onChange instanceof Function) {
                const joindValue = join(values, ',');
                onChange(makeEvent(name, joindValue), { value: joindValue, data: currentOptions });
            }

            if (required) {
                inputRef.current.value = values;
                inputRef.current.setCustomValidity('');
            }
        }
    }, [useAllMulti, currentOptions]);

    const handleChange = (evt) => {
        const isSelectedAllOfMulti = isMulti && evt.target.value.includes(SELECTED_ALL);

        const changedValue = isMulti
            ? isSelectedAllOfMulti
                ? useSelectedAll
                    ? ''
                    : join(
                          currentOptions.map(({ value }) => value),
                          ','
                      )
                : isEmpty(evt.target.value)
                ? ''
                : join(evt.target.value, ',')
            : evt.target.value;

        if (onChange instanceof Function) {
            const changedEvt = {
                ...evt,
                target: {
                    ...evt.target,
                    value: changedValue,
                },
            };
            const selectedOptionData = currentOptions.filter(({ value }) =>
                evt.target.value.includes(value)
            );

            onChange(changedEvt, {
                value: changedValue,
                data: isMulti ? selectedOptionData : get(selectedOptionData, '0', {}),
            });
        }

        if (required) {
            inputRef.current.value = changedValue;
            !isEmpty(changedValue) && inputRef.current.setCustomValidity('');
        }

        setValue(isSelectedAllOfMulti ? changedValue : evt.target.value);
    };

    const getInput = () => {
        switch (restProps.variant) {
            case 'outlined':
                return <OutlinedInput labelWidth={label.length * 8} id={name} />;
            case 'filled':
                return <FilledInput id={name} />;
            default:
                return <Input id={name} />;
        }
    };

    const selectProps = pick(restProps, [
        'autoWidth',
        'children',
        'classes',
        'displayEmpty',
        'input',
        'inputProps',
        'MenuProps',
        'native',
        'onClose',
        'onOpen',
        'open',
        'renderValue',
        'SelectDisplayProps',
        'variant',
        'style',
    ]);

    return (
        <FormControl
            error={Boolean(errorMessage)}
            required={required}
            className={classNames(className, 'min-w-160', {
                'mr-20': isSearch,
            })}
            variant={restProps.variant}
        >
            {label && <InputLabel>{label}</InputLabel>}
            <Select
                {...selectProps}
                renderValue={(selected) => {
                    return (isMulti ? selected : [selected])
                        .map((v) =>
                            v === VALUE_ALL
                                ? VALUE_ALL_TEXT
                                : get(
                                      currentOptions.find((o = {}) => o.value === v),
                                      'label'
                                  )
                        )
                        .join(', ');
                }}
                name={name}
                value={selectedValue}
                multiple={isMulti}
                onChange={handleChange}
                input={getInput()}
                inputProps={{
                    inputRef: selectRef,
                }}
                disabled={disabled}
            >
                {useAllMulti && (
                    <MenuItem classes={{ root: classes.menuItem }} value={SELECTED_ALL}>
                        {`${VALUE_ALL_TEXT}선택 ${useSelectedAll ? '해제' : ''}`}
                    </MenuItem>
                )}
                {(isMulti || removeDefaultOption
                    ? currentOptions || []
                    : [
                          useAll
                              ? { label: VALUE_ALL_TEXT, value: VALUE_ALL }
                              : { label: emptyOptionLabel, value: '' },
                          ...(currentOptions || []),
                      ]
                ).map((item, index) => (
                    <MenuItem key={`owp-select-item-${index}`} disabled={Boolean(item.disabled)} value={item.value}>
                        {useCheckboxMenuWithMenu && !isEmpty(item.value) && (
                            <Checkbox checked={selectedValue.indexOf(item.value) > -1} />
                        )}
                        <ListItemText primary={item.label} />
                    </MenuItem>
                ))}
            </Select>
            {required && (
                <input
                    ref={inputRef}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ opacity: 0, height: 0 }}
                    value={get(inputRef.current, 'value', selectedValue)}
                    onFocus={() => selectRef.current.focus()}
                    onChange={noop}
                    onInvalid={(e) => {
                        e.target.setCustomValidity('목록에서 항목을 선택하세요.');
                    }}
                    required={required}
                />
            )}
            {Boolean(errorMessage) && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
    );
}

OwpSelectField.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.any,
    query: PropTypes.shape({
        url: PropTypes.string,
        params: PropTypes.object,
    }),
    mapper: PropTypes.object,
    useCheckboxMenuWithMenu: PropTypes.bool,
    useAll: PropTypes.bool,
    items: PropTypes.array,
    options: PropTypes.array,
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    groupId: PropTypes.string,
    commonCodes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    isMulti: PropTypes.bool,
    required: PropTypes.bool,
    useReset: PropTypes.bool,
    isReset: PropTypes.bool,
    isSearch: PropTypes.bool,
    disabled: PropTypes.bool,
    removeDefaultOption: PropTypes.bool,
    emptyOptionLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    errorMessage: PropTypes.string,
    onChange: PropTypes.func,
};

OwpSelectField.defaultProps = {
    className: '',
    classes: {},
    name: 'owp-select-field',
    value: '',
    query: {},
    mapper: { label: 'label', value: 'value' },
    groupId: '',
    items: [],
    options: [],
    commonCodes: [],
    isMulti: false,
    required: false,
    useReset: false,
    isReset: false,
    useAll: false,
    useCheckboxMenuWithMenu: true,
    isSearch: false,
    disabled: false,
    removeDefaultOption: false,
    emptyOptionLabel: '',
    errorMessage: '',
    onChange: (event, value) => {},
    setValue: () => {},
};

function mapStateToProps({ owp, auth }) {
    return {
        isReset: owp.wrapper.isReset,
        commonCodes: get(auth, 'common.codes'),
    };
}

export default connect(mapStateToProps)(withStyles(styles)(OwpSelectField));

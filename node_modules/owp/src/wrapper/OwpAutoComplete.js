import { FormControl, FormLabel, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { get, isArray, isPlainObject, noop, toString, uniqueId } from 'lodash';
import { OwpPresetAutocompleteTextField } from 'owp/components';
import { depr } from 'owp/debug';
import React from 'react';

const styles = {
    formLabel: {
        marginTop: -1,
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left',
    },
};

function OwpAutoComplete({
    required,
    useReset,
    isMulti,
    isSearch,
    className,
    style,
    classes,
    id,
    name,
    minInputLength,
    defaultInputValue,
    label,
    placeholder,
    query,
    onChange,
    onInputChange,
    callback,
}) {
    return (
        <FormControl
            name={name}
            required={required}
            className={classNames({ 'mr-20': isSearch, 'mt-12': isSearch && !label })}
        >
            {label && <FormLabel classes={{ root: classes.formLabel }}>{label}</FormLabel>}
            <OwpPresetAutocompleteTextField
                useReset={useReset}
                required={required}
                isMulti={isMulti}
                className={classNames(className, 'min-w-160', { '-mt-8': isSearch && !!label })}
                id={id}
                name={name}
                style={style}
                defaultInputValue={defaultInputValue}
                minInputLength={minInputLength}
                onInputChange={onInputChange}
                placeholder={placeholder}
                query={query}
                onChange={(items) => {
                    const changedEvent = new Event('change', {
                        bubbles: true,
                    });

                    const value = isPlainObject(items)
                        ? toString(get(items, 'value'))
                        : isArray(items)
                        ? items.map(({ value }) => value).join()
                        : '';

                    Object.defineProperty(changedEvent, 'target', {
                        writable: false,
                        value: {
                            name: name,
                            value,
                        },
                    });

                    onChange(changedEvent, value);

                    if (callback instanceof Function) {
                        depr(
                            '[OwpAutoComplete]: `callback(name, value)` prop은 deprecate 되었습니다. `onChange(event, value)` prop을 사용 바랍니다..'
                        );
                        callback(name, value);
                    }
                }}
            />
        </FormControl>
    );
}

OwpAutoComplete.defaultProps = {
    className: '',
    id: `owp-search-auto-complete-${uniqueId()}`,
    name: 'owp-search-auto-complete',
    style: {},
    minInputLength: 2,
    defaultInputValue: '',
    required: false,
    useReset: false,
    isMulti: false,
    isSearch: false,
    label: '',
    placeholder: '',
    query: null,
    onInputChange: noop,
    onChange: noop,
};

export default withStyles(styles)(OwpAutoComplete);

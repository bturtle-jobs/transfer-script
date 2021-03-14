import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { query } from 'owp/api';
import React, { useEffect, useRef, useState } from 'react';

function usePreviousValue(inputValue) {
    const ref = useRef();
    useEffect(() => {
        ref.current = inputValue;
    });
    return ref.current;
}

export const withQuery = (
    mapDataToProps,
    { shouldGetLoadingProp = false, useInputChange = false, dataKey = 'suggestions' } = {}
) => {
    if (typeof mapDataToProps !== 'function') {
        throw new Error('객체(object)를 리턴하는 함수이어야 합니다.');
    }

    return (WrappedComponent) => {
        return (props) => {
            const {
                query: queryOptions = {},
                defaultInputValue = '',
                onInputChange,
                onChange = () => {},
                ...restProps
            } = props;

            const [state, setState] = useState({ [dataKey]: [], isLoading: false });
            const [inputValue, setInputValue] = useState();

            const variableParamKeyRef = useRef(null);
            const useDefaultInputValueRef = useRef(!isEmpty(defaultInputValue));

            const _suggestions = get(state, dataKey);

            const prevInputValue = usePreviousValue(inputValue);
            const prevSuggestions = usePreviousValue(_suggestions);

            useEffect(() => {
                const { params = {} } = queryOptions || {};

                if (useInputChange && !variableParamKeyRef.current) {
                    variableParamKeyRef.current = get(
                        Object.keys(params).filter((key) => !get(params, key)),
                        0
                    );
                }
            });

            useEffect(() => {
                if (
                    (useDefaultInputValueRef.current &&
                        (isEmpty(_suggestions) || !isEqual(_suggestions, prevSuggestions))) ||
                    (!isEmpty(queryOptions) &&
                        !isEqual(prevInputValue, inputValue) &&
                        (!useInputChange || !isEmpty(inputValue)))
                ) {
                    shouldGetLoadingProp && setState({ isLoading: true });

                    const { url, params } = queryOptions;

                    query({
                        url,
                        params: {
                            jsondata: JSON.stringify({
                                ...params,
                                ...(useInputChange &&
                                    !!variableParamKeyRef.current && {
                                        [variableParamKeyRef.current]: useDefaultInputValueRef.current
                                            ? defaultInputValue
                                            : inputValue,
                                    }),
                            }),
                        },
                    })
                        .then((data) => {
                            const suggestions = mapDataToProps(data, { ...props });
                            setState({
                                ...suggestions,
                                ...(shouldGetLoadingProp && { isLoading: false }),
                            });

                            const suggestion = useDefaultInputValueRef.current
                                ? get(suggestions, 'suggestions.0')
                                : '';
                            if (useDefaultInputValueRef.current && !isEmpty(suggestion)) {
                                onChange(suggestion);
                                return;
                            }
                        })
                        .catch((error) => {
                            console.error('error', error);
                            shouldGetLoadingProp && setState({ isLoading: false });
                        });

                    return;
                }

                // !useDefaultInputValueRef.current && setState({ [dataKey]: [], isLoading: false });
            }, [queryOptions, inputValue]);

            return (
                <WrappedComponent
                    {...restProps}
                    {...state}
                    {...(useDefaultInputValueRef.current && { value: get(state, `${dataKey}.0`) })}
                    onChange={(selected) => {
                        if (isEmpty(selected)) {
                            useDefaultInputValueRef.current = false;
                            setInputValue('');
                        }
                        onChange(selected);
                    }}
                    setUseDefaultInputValue={(flag = true) => {
                        useDefaultInputValueRef.current = flag;
                    }}
                    onInputChange={
                        useInputChange
                            ? debounce(
                                  (value = '') => {
                                      useDefaultInputValueRef.current = false;
                                      setInputValue(value);
                                      if (onInputChange instanceof Function) {
                                          onInputChange(value);
                                      }
                                  },
                                  variableParamKeyRef.current ? 300 : 0
                              )
                            : onInputChange
                    }
                />
            );
        };
    };
};

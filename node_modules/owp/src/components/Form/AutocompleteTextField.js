import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { complement, isNil } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

const isNotNil = complement(isNil);

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        position: 'relative',
        // height: 100,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
    selectWrapper: {
        position: 'relative',
        zIndex: 1,
    },
    inputRequired: {
        position: 'absolute',
        border: 0,
        color: 'transparent',
        backgroundColor: 'transparent',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}
//className={`${classes.navbarContent} hidden-scrollbar`}
function ValueContainer(props) {
    return (
        <div className={`${props.selectProps.classes.valueContainer} IMPIX IMPIX`}>
            {props.children}
        </div>
    );
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};

class AutocompleteTextField extends React.Component {
    state = {
        inputValue: '',
        single: null,
        multi: null,
    };

    inputRef = React.createRef(null);

    componentDidUpdate() {
        if (
            this.props.useReset &&
            this.props.isReset &&
            !isEmpty(get(this.selector, 'select.props.value')) &&
            get(this.selector, 'select.clearValue') instanceof Function
        ) {
            this.selector.select.clearValue();
        }
    }

    handleChange = (value) => {
        const selectedValue = isNotNil(value) ? value : '';
        this.props.onChange(selectedValue);

        if (this.props.required) {
            this.inputRef.current.value = selectedValue;
            if (!!selectedValue) {
                this.inputRef.current.setCustomValidity('');
            }
        }
    };

    handleInputChange = (inputValue) =>
        this.setState({ inputValue }, () => {
            if (
                this.props.minInputLength === 0 ||
                this.state.inputValue.length >= this.props.minInputLength
            ) {
                this.props.onInputChange(inputValue);
            }
        });

    handleNoOptionsMessage = () => {
        return this.props.minInputLength !== 0 &&
            this.state.inputValue.length > 0 &&
            this.state.inputValue.length <= this.props.minInputLength - 1
            ? `검색어는 ${this.props.minInputLength}자 이상 입력해야합니다.`
            : this.props.noOptionsMessage;
    };

    makeValue = (value) => {
        const getValueFromsuggestions = (value) =>
            this.props.suggestions.filter(
                (suggestion = {}) => suggestion.value === parseInt(value)
            );
        return typeof value === 'string' || typeof value === 'number'
            ? getValueFromsuggestions(value)
            : typeof value === 'object' && !value.label && !!value.value
            ? getValueFromsuggestions(value.value)
            : value;
    };

    render() {
        const {
            classes,
            theme,
            required,
            value,
            suggestions,
            noOptionsMessage,
            placeholder,
            onChange,
            onInputChange,
            setUseDefaultInputValue,
            className,
            style,
            ...restProps
        } = this.props;

        const selectStyles = {
            input: (base) => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };

        return (
            <div className={classes.root} style={style}>
                <Select
                    ref={(c) => (this.selector = c)}
                    isClearable
                    {...restProps}
                    className={classNames(classes.selectWrapper, className)}
                    classes={classes}
                    styles={selectStyles}
                    options={suggestions}
                    components={components}
                    placeholder={placeholder}
                    noOptionsMessage={this.handleNoOptionsMessage}
                    value={this.makeValue(value)}
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    onMenuOpen={() => {
                        setUseDefaultInputValue(false);
                    }}
                />
                {required && (
                    <input
                        ref={this.inputRef}
                        tabIndex={-1}
                        type="text"
                        autoComplete="off"
                        className={classes.inputRequired}
                        value={get(this.inputRef.current, 'value', '')}
                        required={required}
                        onFocus={() => this.selector.focus()}
                        onChange={noop}
                        onInvalid={(e) => {
                            e.target.setCustomValidity('선택된 항목이 없습니다.');
                        }}
                    />
                )}
            </div>
        );
    }
}

AutocompleteTextField.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    noOptionsMessage: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
        PropTypes.array,
    ]),
    suggestions: PropTypes.array,
    required: PropTypes.bool,
    /**
     * N개 선택하려면 true
     */
    isMulti: PropTypes.bool,
    isLoading: PropTypes.bool,
    isReset: PropTypes.bool,
    useReset: PropTypes.bool,
    setUseDefaultInputValue: PropTypes.func,
    onInputChange: PropTypes.func,
    /**
     * 설정된 입력값 > length 시 검색 실행
     */
    minInputLength: PropTypes.number,
};

AutocompleteTextField.defaultProps = {
    noOptionsMessage: '검색된 데이터가 없습니다.',
    placeholder: '검색',
    suggestions: [],
    required: false,
    isMulti: false,
    isLoading: false,
    isReset: false,
    useReset: false,
    minInputLength: 0,
    setUseDefaultInputValue: () => {},
    onInputChange: (inputValue) => {},
};

function mapStateToProps({ owp }) {
    return {
        isReset: owp.wrapper.isReset,
    };
}

export default withStyles(styles, { withTheme: true })(
    connect(mapStateToProps)(AutocompleteTextField)
);

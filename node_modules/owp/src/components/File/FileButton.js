import Button from '@material-ui/core/Button';
import uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

const genId = id => {
    return id || uniqueId('owp-file-button-');
};

const FileButton = ({
    id,
    WrapperComponent,
    ButtonComponent,
    ButtonComponentProps,
    onChange,
    isUploading,
    dispatch, // eslint-disable-line no-unused-vars
    ...restProps
}) => {
    const uid = useRef(genId(id));

    return (
        <WrapperComponent>
            <input
                {...restProps}
                id={uid.current}
                className="hidden"
                multiple
                type="file"
                disabled={isUploading}
                onChange={event => {
                    onChange(Array.from(event.target.files), event);
                }}
            />
            <label htmlFor={uid.current}>
                <ButtonComponent {...ButtonComponentProps} component="span" />
            </label>
        </WrapperComponent>
    );
};

FileButton.propTypes = {
    id: PropTypes.string,
    WrapperComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    ButtonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    ButtonComponentProps: PropTypes.object,
    isUploading: PropTypes.bool,
    onChange: PropTypes.func,
};

FileButton.defaultProps = {
    WrapperComponent: 'span',
    ButtonComponent: Button,
    ButtonComponentProps: {
        variant: 'contained',
        color: 'primary',
        children: '파일',
    },
    isUploading: false,
    onChange: () => {},
};

export default FileButton;

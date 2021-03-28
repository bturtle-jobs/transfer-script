import { Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import every from 'lodash/every';
import last from 'lodash/last';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import React, { useRef, useState } from 'react';

const _stop = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

const onDragOver = (event) => {
    _stop(event);
};

const FileDndZone = ({
    style,
    className,
    onDrop,
    onChange,
    isUploading,
    accept,
    label,
    multiple,
    useDir,
    useClickButtonEvent,
    dispatch, // eslint-disable-line no-unused-vars
    ...restProps
}) => {
    const fileInputButtonInstance = useRef(null);
    const [dragging, setDragging] = useState(false);
    const onDragEnter = (event) => {
        _stop(event);
        setDragging(true);
    };

    const onDragLeave = (event) => {
        _stop(event);
        setDragging(false);
    };

    const validateFileType = (file = {}) =>
        accept.indexOf(last(file.name.split('.')).toLowerCase()) !== -1;

    const handleDrop = (event) => {
        _stop(event);

        setDragging(false);

        if (!isUploading && path(['dataTransfer', 'files', 'length'], event)) {
            const arrayFiles = Array.from(event.dataTransfer.files);

            if (
                !!accept &&
                !(multiple
                    ? every(arrayFiles.map(validateFileType))
                    : validateFileType(arrayFiles[0]))
            ) {
                onDrop();
                return;
            }

            onDrop(arrayFiles);
        }
    };

    const handleChange = (event) => {
        if (!isUploading && path(['target', 'files'], event)) {
            onChange(Array.from(event.target.files));
        }
    };

    const classes = classNames(
        'w-full h-full flex justify-center items-center',
        {
            'border-4 border-dashed opacity-50': dragging,
        },
        className
    );

    return (
        <Paper
            {...restProps}
            style={{ width: 400, height: 300, ...style }}
            className={classes}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onClick={() => useClickButtonEvent && fileInputButtonInstance.current.click()}
            onDrop={handleDrop}
        >
            <input
                multiple={multiple}
                type="file"
                accept={accept}
                ref={fileInputButtonInstance}
                onClick={(evt) => (evt.target.value = '')}
                onChange={handleChange}
                hidden
                {...(useDir && {
                    directory: '',
                    webkitdirectory: '',
                })}
            />
            <Typography variant="subtitle1" color="textSecondary" className="pointer-events-none">
                {isUploading ? '파일을 업로드 중입니다.' : label}
            </Typography>
        </Paper>
    );
};

FileDndZone.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    /**
     * Drop Event 인 경우
     */
    onDrop: PropTypes.func,
    /**
     * Click Event 인 경우
     */
    onChange: PropTypes.func,
    isUploading: PropTypes.bool,
    /**
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
     */
    accept: PropTypes.string,
    /**
     * Drop Zone label
     */
    label: PropTypes.string,
    /**
     * N개 파일을 업로드 하려면 true
     */
    multiple: PropTypes.bool,
    /**
     * Click Event 허용 여부
     */
    useDir: PropTypes.bool,
    useClickButtonEvent: PropTypes.bool,
};

FileDndZone.defaultProps = {
    style: {},
    onDrop: (files) => {},
    onChange: (files) => {},
    isUploading: false,
    accept: '',
    label: '이곳에 파일을 끌어놓으세요.,',
    multiple: true,
    useDir: false,
    useClickButtonEvent: false,
};

export default FileDndZone;

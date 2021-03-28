import axios from 'axios';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import FileButton from './FileButton';
import FileDndZone from './FileDndZone';

const OwpPresetFileUploader = ({
    userSeq,
    pageId,
    componentType,
    onProgress,
    onComplete,
    onError,
    dispatch,
    ...restProps
}) => {
    const FileComponent = componentType === 'dnd' ? FileDndZone : FileButton;
    const [isUploading, setUploading] = useState(false);

    const handleUpload = async (files) => {
        const form = new FormData();
        files.forEach((file, index) => {
            form.append(`FILE_TAG_${index}`, file);
        });

        form.append('PAGEID', pageId);
        form.append('WUSERSEQ', userSeq);

        try {
            setUploading(true);

            const result = await axios({
                method: 'post',
                url: '/uploadFileRestService',
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
                data: form,
            });

            onComplete(path(['data', 'resultData'], result));
        } catch (error) {
            console.error(error);
            onError(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <FileComponent
            {...restProps}
            onChange={handleUpload} // button
            onDrop={handleUpload} // dnd
            isUploading={isUploading}
        />
    );
};

OwpPresetFileUploader.propTypes = {
    /**
     * 타입 선택
     */
    componentType: PropTypes.oneOf(['button', 'dnd']),
    /**
     * 파일 업로드 성공 후 호출.
     * 파라미터: [{ ...resData}, ...]
     */
    onComplete: PropTypes.func,
    onError: PropTypes.func,
    /**
     * PAGE ID
     */
    pageId: PropTypes.string,
    /**
     * 디렉토리 선택 여부
     */
    useDir: PropTypes.bool,
    /**
     * @ignore
     */
    userSeq: PropTypes.number,
};

OwpPresetFileUploader.defaultProps = {
    componentType: 'button',
    useDir: false,
    onComplete: (data) => {},
    onError: (error) => {},
    pageId: null,
    userSeq: null,
};

function mapStateToProps({ auth, owp }) {
    return {
        userSeq: path(['user', 'data', 'userSeq'], auth),
    };
}

export default connect(mapStateToProps)(OwpPresetFileUploader);

import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import { data } from 'autoprefixer';
import { OwpDialog, OwpButton } from 'owp/wrapper';

const ImageUpload = ({ classes, onUploadSuccess, imageValue, onDeleteImage }) => {
    const [isUploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [images, setImages] = useState(imageValue ? imageValue : []);
    const [open, setOpen] = useState(false);

    const inputFileRef = React.useRef();

    const fileUploadAction = () => {
        inputFileRef.current.click();
    };

    //TODO: using another syntax
    useEffect(() => {
        setImages(imageValue);
    }, [imageValue]);
    const handleOnChange = (event) => {
        let files = event.target.files[0];
        if (files) {
            uploadFile(files);
        }
    };

    const zoomImage = () => {
        console.log('zoomImage');
        setOpen(true);
    };
    const closeImage = () => {
        console.log('aaa');
        setOpen(false);
        console.log(open);
    };

    //TODO:read image here
    const renderImages = (image) => {
        return (
            <div className="inline" key={image.fileSeq}>
                <img
                    style={{ padding: '3px', objectFit: 'cover' }}
                    width="45"
                    height="45"
                    src={`http://localhost:8080/OWP_SKBTMES_SERVICE/restService/images/${image.fileSeq}`}
                ></img>
            </div>
        );
    };

    const deleteImage = (image, index) => {
        if (onDeleteImage) {
            onDeleteImage(image);
        }
    };

    const renderZoomImage = (image, index) => {
        return (
            <div className="col-lg-6" key={image.fileSeq}>
                <div>
                    <div
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                        }}
                    >
                        <OwpButton
                            style={{ right: '150px', position: 'absolute' }}
                            color="secondary"
                            variant="contained"
                            onClick={() => deleteImage(image, index)}
                        >
                            삭제
                        </OwpButton>
                    </div>

                    <a
                        href={`http://localhost:8080/OWP_SKBTMES_SERVICE/restService/images/${image.fileSeq}`}
                        target="_blank"
                    >
                        <img
                            style={{ padding: '3px', objectFit: 'cover', borderRadius: '10px' }}
                            width="230"
                            height="230"
                            src={`http://localhost:8080/OWP_SKBTMES_SERVICE/restService/images/${image.fileSeq}`}
                        ></img>
                    </a>
                </div>
            </div>
        );
    };

    const uploadFile = async (file) => {
        let formData = new FormData();
        formData.append('file', file);
        try {
            await axios({
                method: 'post',
                url: '/uploadFileRestService',
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
                data: formData,
            })
                .then((res) => {
                    if (res.data.resultData[0]) {
                        let imageInfo = {
                            fileName: res.data.resultData[0].FileName,
                            fileSeq: res.data.resultData[0]['IPX_FILE.FILESEQ'],
                        };
                        setImages((images) => {
                            return [...images, imageInfo];
                        });

                        if (onUploadSuccess) {
                            onUploadSuccess(imageInfo);
                        }
                    }
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <React.Fragment>
                <div className="inline">
                    <div className="inline" onClick={zoomImage}>
                        {images?.length > 0 &&
                            images.map((item, i) => {
                                if (i < 2) {
                                    return renderImages(item);
                                }
                            })}
                        {images?.length > 2 && <span>...</span>}
                    </div>

                    {/* change this syntax */}
                    <div className="inline">
                        <input
                            ref={inputFileRef}
                            id="file"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleOnChange}
                        />
                        <OwpButton color="secondary" variant="contained" onClick={fileUploadAction}>
                            업로드
                        </OwpButton>
                    </div>
                </div>
                <OwpDialog
                    onOpen={open}
                    width="500px"
                    height="500px"
                    dialogActions={
                        <React.Fragment>
                            <div className="w-full center">
                                <OwpButton
                                    color="secondary"
                                    variant="outlined"
                                    onClick={closeImage}
                                >
                                    취소
                                </OwpButton>
                            </div>
                        </React.Fragment>
                    }
                >
                    <React.Fragment>
                        <div
                            className="row"
                            style={{
                                maxHeight: '490px',
                                overflowX: 'hidden',
                                overflowY: 'auto',
                            }}
                        >
                            <div className="col-lg-6">
                                <div
                                    onClick={fileUploadAction}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        width: '230px',
                                        height: '230px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <span
                                        style={{
                                            color: '#595959',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            display: 'inline-block',
                                        }}
                                    >
                                        업로드
                                    </span>
                                </div>
                            </div>
                            {images?.length > 0 &&
                                images.map((item, i) => {
                                    return renderZoomImage(item, i);
                                })}
                        </div>
                    </React.Fragment>
                </OwpDialog>
            </React.Fragment>
        </>
    );
};

export default ImageUpload;

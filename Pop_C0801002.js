import {
    OwpTextField,
    OwpButton,
    OwpSelectField,
    OwpDialog,
    OwpMessage,
    OwpTreeGrid,
    OwpSearchDateTimePickerMulti,
    OwpSearchSelectField,
    OwpSearchTextField,
    OwpDateTimePicker,
    OwpSearchDateField,
    OwpSearchMonthPicker,
} from 'owp/wrapper';
import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { mutate, query } from 'owp/api';
import * as TGEvent from 'owp/TGEvent';
import { FileButton } from 'owp/components';
import moment from 'moment';
import { Button } from '@material-ui/core';
import ImageUpload from '../../custom-component/ImageUpload';

import axios from 'axios';

let KOREAN_FORMAT_DATE = 'YYYY-MM-DD';
let KOREAN_FORMAT_MONTH_YEAR = 'YYYY-MM';

function getMonthYearFromDate(date) {
    if (date) {
        console.log(moment(date, KOREAN_FORMAT_DATE).format(KOREAN_FORMAT_MONTH_YEAR));
        return moment(date, KOREAN_FORMAT_DATE).format(KOREAN_FORMAT_MONTH_YEAR);
    }
    return '';
}

function getMomentDateFromDate(date) {
    if (date) {
        // return moment(date, KOREAN_FORMAT_DATE).format(KOREAN_FORMAT_DATE) + '';
        return date;
    }
    return moment() + '';
}

function fillMissingDateValue(date) {
    if (date) {
        return date + '-01';
    }
    return moment().format(KOREAN_FORMAT_DATE);
}

class DialogReweighing extends Component {
    constructor(props) {
        super(props);
        this.owpDialog = React.createRef();
        this.state = {
            isDialogOpen: props.isDialogOpen,
            isDialogCheckOpen: false,
            popMessage: '저장하시겠습니까',
        };
    }

    componentDidMount() {
        console.log('DialogReweighing');
    }
    onUploadImages = (image) => {
        this.setState((state) => {
            return {
                ...state,
                FACILITY_IMAGE: [...state.FACILITY_IMAGE, { fileSeq: image.fileSeq }],
            };
        });
        console.log(this.state);
    };

    onDeleteImage = (image) => {
        if (image) {
            this.setState((state) => {
                return {
                    ...state,
                    FACILITY_IMAGE: state.FACILITY_IMAGE.filter(
                        (item) => item.fileSeq != image.fileSeq
                    ),
                };
            });
        }
    };

    onUploadFloorPlan = (image) => {
        this.setState((state) => {
            return { FLOOR_PLAN_FILESEQ: [image] };
        });
    };

    onDeleteFloorPlan = (image) => {
        if (image) {
            this.setState((state) => {
                return {
                    ...state,
                    FLOOR_PLAN_FILESEQ: [],
                };
            });
        }
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    openDialog_customer = () => {
        console.log('call in side');
    };

    onDialogOpen = () => {
        console.log('on parse');
        if (isMissingParam(this.props.FACILITY_SEQ)) {
            //TODO: add warning message
            this.closeDialog();
        }
        this.handleLoad();
        this.setState((state) => {
            return { isDialogOpen: true };
        });
    };

    setMonthPickerValue = (value) => {
        return value;
    };

    openDialogCheck = () => {
        //TODO:verify data before popup
        this.setState({ isDialogCheckOpen: true });
        this.setState({ popMessage: '저장하시겠습니까?' });
    };

    closeDialogCheck = () => {
        this.setState({ isDialogCheckOpen: false });
    };

    handleFileUploadChange = (event) => {
        let files = event.target.files[0];
        if (files) {
            this.uploadFile(files);
        }
    };

    //TODO: move this to component
    //TODO:
    uploadFile = async (file) => {
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
                    console.log(res);
                })
                .catch((error) => console.error(error));
        } catch (error) {
            console.error(error);
        }
    };

    handleLoad = () => {
        query({ url: 'loadOwpFacilitiesWithImages/' + this.props.FACILITY_SEQ })
            .then((res) => {
                //TODO:convert images
                let imagesState = [];
                if (res['OWP_FACILITIES.IMAGES']) {
                    let imagesRaw = res['OWP_FACILITIES.IMAGES'];
                    for (let i = 0; i < imagesRaw.length; i++) {
                        imagesState.push({
                            fileSeq: imagesRaw[i].OWP_FACILITY_FILE_LINK.FILESEQ + '',
                        });
                    }
                }

                let floorPlanFileSeqState = [];
                if (res['OWP_FACILITIES.FLOOR_PLAN_FILESEQ']) {
                    floorPlanFileSeqState = [{ fileSeq: res['OWP_FACILITIES.FLOOR_PLAN_FILESEQ'] }];
                }

                this.setState((state) => {
                    return {
                        FACILITY_ID: res['OWP_FACILITIES.FACILITY_ID'],
                        FACILITY_NAME: res['OWP_FACILITIES.FACILITY_NAME'],
                        LEVEL_CD: res['OWP_FACILITIES.LEVEL_CD'],
                        LOCATION_CD: res['OWP_FACILITIES.LOCATION_CD'],
                        FACILITY_COMMENT: res['OWP_FACILITIES.FACILITY_COMMENT'],
                        FACILITY_MT_FREQUENCY: res['OWP_FACILITIES.FACILITY_MT_FREQUENCY'],

                        FACILITY_METHOD: res['OWP_FACILITIES.FACILITY_METHOD'],
                        FACILITY_SIZE: res['OWP_FACILITIES.FACILITY_SIZE'],
                        FACILITY_MANUFACTURE: res['OWP_FACILITIES.FACILITY_MANUFACTURE'],
                        FACILITY_MANUF_COUNTRY: res['OWP_FACILITIES.FACILITY_MANUF_COUNTRY'],
                        FACILITY_YEAR_MONTH: getMonthYearFromDate(
                            res['OWP_FACILITIES.FACILITY_YEAR_MONTH']
                        ),
                        FACILITY_MODEL_NAME: res['OWP_FACILITIES.FACILITY_MODEL_NAME'],
                        FACILITY_SERIAL_NO: res['OWP_FACILITIES.FACILITY_SERIAL_NO'],
                        FACILITY_CONTACT_POINT: res['OWP_FACILITIES.FACILITY_CONTACT_POINT'],
                        FACILITY_ASSET_NO: res['OWP_FACILITIES.FACILITY_ASSET_NO'],
                        FACILITY_PURCHASE_AMT: res['OWP_FACILITIES.FACILITY_PURCHASE_AMT'],
                        FACILITY_PURCHASE_DATE: res['OWP_FACILITIES.FACILITY_PURCHASE_DATE']
                            ? moment(res['OWP_FACILITIES.FACILITY_PURCHASE_DATE']).format(
                                  KOREAN_FORMAT_DATE
                              )
                            : '',
                        FACILITY_CAPACITY: res['OWP_FACILITIES.FACILITY_CAPACITY'],
                        FACILITY_TYPE: res['OWP_FACILITIES.FACILITY_TYPE'],
                        FACILITY_MATERIAL: res['OWP_FACILITIES.FACILITY_MATERIAL'],
                        FACILITY_POWER: res['OWP_FACILITIES.FACILITY_POWER'],
                        FACILITY_CAPACITY_KW: res['OWP_FACILITIES.FACILITY_CAPACITY_KW'],
                        FACILITY_CHECK_CYCLE: res['OWP_FACILITIES.FACILITY_CHECK_CYCLE'],
                        FACILITY_IMAGE: imagesState,
                        FLOOR_PLAN_FILESEQ: floorPlanFileSeqState,
                    };
                });
                console.log(this.state);
            })
            .catch((error) => {
                //TODO:do some thing here
            });
    };

    closeDialog = () => {
        this.setState((state) => {
            return { isDialogOpen: false };
        });
        this.owpDialog.handleClose();
    };

    opUpdate = async (type) => {
        //TODO:convert data
        const data = {
            cudtype: 'update',
            'OWP_FACILITIES.FACILITY_SEQ': this.props.FACILITY_SEQ + '',
            'OWP_FACILITIES.LEVEL_CD': this.state.LEVEL_CD,
            'OWP_FACILITIES.LOCATION_CD': this.state.LOCATION_CD,
            'OWP_FACILITIES.FACILITY_COMMENT': this.state.FACILITY_COMMENT,
            'OWP_FACILITIES.FACILITY_METHOD': this.state.FACILITY_METHOD,
            'OWP_FACILITIES.FACILITY_SIZE': this.state.FACILITY_SIZE,
            'OWP_FACILITIES.FACILITY_MANUFACTURE': this.state.FACILITY_MANUFACTURE,
            'OWP_FACILITIES.FACILITY_MANUF_COUNTRY': this.state.FACILITY_MANUF_COUNTRY,
            'OWP_FACILITIES.FACILITY_MODEL_NAME': this.state.FACILITY_MODEL_NAME,
            'OWP_FACILITIES.FACILITY_SERIAL_NO': this.state.FACILITY_SERIAL_NO,
            'OWP_FACILITIES.FACILITY_ASSET_NO': this.state.FACILITY_ASSET_NO,
            'OWP_FACILITIES.FACILITY_PURCHASE_AMT': this.state.FACILITY_PURCHASE_AMT,
            'OWP_FACILITIES.FACILITY_CAPACITY': this.state.FACILITY_CAPACITY,
            'OWP_FACILITIES.FACILITY_TYPE': this.state.FACILITY_TYPE,
            'OWP_FACILITIES.FACILITY_MATERIAL': this.state.FACILITY_MATERIAL,
            'OWP_FACILITIES.FACILITY_CAPACITY_KW': this.state.FACILITY_CAPACITY_KW + '',
            'OWP_FACILITIES.FACILITY_CHECK_CYCLE': this.state.FACILITY_CHECK_CYCLE,

            'OWP_FACILITIES.FACILITY_PURCHASE_DATE': getMomentDateFromDate(
                this.state.FACILITY_PURCHASE_DATE
            ),
            'OWP_FACILITIES.FACILITY_YEAR_MONTH': fillMissingDateValue(
                this.state.FACILITY_YEAR_MONTH
            ),
            'OWP_FACILITIES.FACILITY_POWER': this.state.FACILITY_POWER,
            'OWP_FACILITIES.FACILITY_IMAGE': this.state.FACILITY_IMAGE,
        };

        console.log(data);

        const result = await mutate({
            url: '/updateOwpFacilitiesWithImage',
            data,
        }).then((res) => {
            const G = TGEvent.getGridByID('C0801000');
            G.ReloadBody();
            this.closeDialogCheck();
            this.closeDialog();
        });
    };

    clickUpdate = () => {
        //TODO:verify data here before call update
        this.opUpdate('START');
    };

    uploadImage = () => {
        console.log('upload images');
    };

    render() {
        return (
            <OwpDialog
                title="설비.장비 수정"
                callbackFunction={this.onDialogOpen}
                onOpen={this.state.isDialogOpen}
                dialogButton="수정"
                dialogActions={
                    <React.Fragment>
                        <div className="w-full center">
                            <OwpButton
                                color="secondary"
                                variant="contained"
                                onClick={this.openDialogCheck}
                            >
                                수정
                            </OwpButton>
                            <OwpButton
                                color="secondary"
                                variant="outlined"
                                onClick={this.closeDialog}
                            >
                                취소
                            </OwpButton>
                        </div>
                    </React.Fragment>
                }
                innerRef={(ref) => (this.owpDialog = ref)}
                width="1100px"
                height="auto"
            >
                <React.Fragment>
                    <OwpDialog
                        onOpen={this.state.isDialogCheckOpen}
                        dialogActions={
                            <React.Fragment>
                                <div className="w-full center">
                                    <OwpButton
                                        color="secondary"
                                        variant="contained"
                                        onClick={this.clickUpdate}
                                    >
                                        저장
                                    </OwpButton>
                                    <OwpButton
                                        color="secondary"
                                        variant="outlined"
                                        onClick={this.closeDialogCheck}
                                    >
                                        취소
                                    </OwpButton>
                                </div>
                            </React.Fragment>
                        }
                    >
                        <React.Fragment>{this.state.popMessage}</React.Fragment>
                    </OwpDialog>
                    <Formsy>
                        <div style={{ width: '100%' }}>
                            <table className="table table-bordered table-advance tlw5">
                                <tbody>
                                    <tr>
                                        <th className="center" width="120">
                                            설비/장비명
                                        </th>
                                        <td className="center">
                                            <OwpSelectField
                                                className="w-full"
                                                id="b"
                                                name="b"
                                                options={[
                                                    { label: '설비/장비명1', value: '1' },
                                                    { label: '설비/장비명1', value: '2' },
                                                ]}
                                                value={'1'}
                                            />
                                        </td>
                                        <th className="center" width="120">
                                            설비번호(코드)
                                        </th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_ID"
                                                name="FACILITY_ID"
                                                value={this.state.FACILITY_ID}
                                            />
                                        </td>
                                        <th className="center" width="120">
                                            설치장소
                                        </th>
                                        <td className="center">
                                            <OwpSelectField
                                                className="w-full"
                                                id="LOCATION_CD"
                                                name="LOCATION_CD"
                                                value={this.state.LOCATION_CD}
                                                groupId={'D801100'}
                                                onChange={this.handleChange}
                                                useAll={true}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">크기</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_SIZE"
                                                name="FACILITY_SIZE"
                                                value={this.state.FACILITY_SIZE}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">제조사</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_MANUFACTURE"
                                                name="FACILITY_MANUFACTURE"
                                                value={this.state.FACILITY_MANUFACTURE}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">제조국</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_MANUF_COUNTRY"
                                                name="FACILITY_MANUF_COUNTRY "
                                                value={this.state.FACILITY_MANUF_COUNTRY}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">제작연도/월</th>
                                        <td className="center">
                                            <OwpSearchMonthPicker
                                                label={''}
                                                id="FACILITY_YEAR_MONTH"
                                                name="FACILITY_YEAR_MONTH"
                                                onChange={this.handleChange}
                                                value={this.state.FACILITY_YEAR_MONTH}
                                                initNow={true}
                                            />
                                        </td>
                                        <th className="center">모델명</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_MODEL_NAME"
                                                name="FACILITY_MODEL_NAME"
                                                value={this.state.FACILITY_MODEL_NAME}
                                                setValue={this.setMonthPickerValue}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">일련번호</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_SERIAL_NO"
                                                name="FACILITY_SERIAL_NO"
                                                value={this.state.FACILITY_SERIAL_NO}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">연락처</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_CONTACT_POINT"
                                                name="FACILITY_CONTACT_POINT"
                                                value={this.state.FACILITY_CONTACT_POINT}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">자산번호</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_ASSET_NO"
                                                name="FACILITY_ASSET_NO"
                                                value={this.state.FACILITY_ASSET_NO}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">취득가액</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_PURCHASE_AMT"
                                                name="FACILITY_PURCHASE_AMT"
                                                value={this.state.FACILITY_PURCHASE_AMT}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">취득일</th>
                                        <td className="center">
                                            <OwpSearchDateField
                                                style={{ width: '100%' }}
                                                id="FACILITY_PURCHASE_DATE"
                                                name="FACILITY_PURCHASE_DATE"
                                                value={this.state.FACILITY_PURCHASE_DATE}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">비고</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_COMMENT"
                                                id="FACILITY_COMMENT"
                                                value={this.state.FACILITY_COMMENT}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">이미지</th>
                                        <td className="center">
                                            <ImageUpload
                                                imageValue={this.state.FACILITY_IMAGE}
                                                onUploadSuccess={this.onUploadImages}
                                                onDeleteImage={this.onDeleteImage}
                                            ></ImageUpload>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">용량</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_CAPACITY"
                                                id="FACILITY_CAPACITY"
                                                value={this.state.FACILITY_CAPACITY}
                                                onChange={this.handleChange}
                                            />
                                        </td>

                                        <th className="center">타입(형식)</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_TYPE"
                                                id="FACILITY_TYPE"
                                                value={this.state.FACILITY_TYPE}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">재질</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_MATERIAL"
                                                id="FACILITY_MATERIAL"
                                                value={this.state.FACILITY_MATERIAL}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="center">전원</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_POWER"
                                                id="FACILITY_POWER"
                                                value={this.state.FACILITY_POWER}
                                                onChange={this.handleChange}
                                            />
                                        </td>

                                        <th className="center">용량</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_CAPACITY_KW"
                                                id="FACILITY_CAPACITY_KW"
                                                value={this.state.FACILITY_CAPACITY_KW}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">도면</th>
                                        <td className="center">
                                            <ImageUpload
                                                imageValue={this.state.FLOOR_PLAN_FILESEQ}
                                                onUploadSuccess={this.onUploadFloorPlan}
                                                onDeleteImage={this.onDeleteFloorPlan}
                                            ></ImageUpload>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="center">설비등급</th>
                                        <td className="center">
                                            <OwpSelectField
                                                className="w-full"
                                                id="LEVEL_CD"
                                                name="LEVEL_CD"
                                                value={this.state.LEVEL_CD}
                                                groupId={'D801200'}
                                                onChange={this.handleChange}
                                                useAll={true}
                                            />
                                        </td>

                                        <th className="center">점검주기</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_CHECK_CYCLE"
                                                id="FACILITY_CHECK_CYCLE"
                                                value={this.state.FACILITY_CHECK_CYCLE}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center">보전방식</th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                name="FACILITY_METHOD"
                                                id="FACILITY_METHOD"
                                                value={this.state.FACILITY_METHOD}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Formsy>
                </React.Fragment>
            </OwpDialog>
        );
    }
}

function isMissingParam(param) {
    if (param === null || param === '' || param === undefined) {
        return true;
    }
    return false;
}

export default withStyles({ withTheme: true })(DialogReweighing);

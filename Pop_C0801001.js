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
    OwpSearchMonthPicker,
    OwpSearchDateField,
} from 'owp/wrapper';
import React, { Component } from 'react';
import Formsy from 'formsy-react';
import { mutate } from 'owp/api';
import * as TGEvent from 'owp/TGEvent';
import moment from 'moment';
import ImageUpload from '../../custom-component/ImageUpload';

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
        this.clickCreate = this.clickCreate.bind(this);
        this.onSave = this.onSave.bind(this);
        this.state = {
            isDialogOpen: false,
            isDialogCheckOpen: false,
            popMessage: '저장하시겠습니까',
            FACILITY_IMAGE: [],
            FLOOR_PLAN_FILESEQ: [],
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    closeDialog = () => {
        console.log('closeDialog a');
        this.setState({ isDialogOpen: false });
        this.owpDialog.handleClose();
    };

    // 등록 화면 닫기
    createDialogClose = () => {
        console.log('call when open');
        this.setState({ isDialogCheckOpen: false });
        this.owpDialog.handleClose();
    };

    openDialogCheck = () => {
        //TODO:move this to another function
        //TODO:verify data before popup
        this.setState({ isDialogCheckOpen: true });
        this.setState({ popMessage: '저장하시겠습니까?' });
    };

    onUploadImages = (image) => {
        this.setState((state) => {
            return { FACILITY_IMAGE: [...state.FACILITY_IMAGE, image] };
        });
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

    closeDialogCheck = () => {
        this.setState({ isDialogCheckOpen: false });
    };

    clickCreate() {
        this.onSave('START');
        console.log('save');
    }

    onSave = async (type) => {
        //TODO: convert array image to get floorplan
        const floorPlanFileSeq =
            this.state.FLOOR_PLAN_FILESEQ.length === 1
                ? this.state.FLOOR_PLAN_FILESEQ[0].fileSeq + ''
                : '';

        const data = {
            cudtype: 'create',
            'OWP_FACILITIES.FLAG': 'Y',

            'OWP_FACILITIES.FACILITY_ID': this.state.FACILITY_ID ? this.state.FACILITY_ID : '',
            'OWP_FACILITIES.FACILITY_NAME': this.state.FACILITY_NAME
                ? this.state.FACILITY_NAME
                : '',
            'OWP_FACILITIES.LEVEL_CD': this.state.LEVEL_CD ? this.state.LEVEL_CD : '',
            'OWP_FACILITIES.LOCATION_CD': this.state.LOCATION_CD ? this.state.LOCATION_CD : '',
            'OWP_FACILITIES.FACILITY_COMMENT': this.state.FACILITY_COMMENT
                ? this.state.FACILITY_COMMENT
                : '',
            'OWP_FACILITIES.FACILITY_METHOD': this.state.FACILITY_METHOD
                ? this.state.FACILITY_METHOD
                : '',
            'OWP_FACILITIES.FACILITY_SIZE': this.state.FACILITY_SIZE
                ? this.state.FACILITY_SIZE
                : '',
            'OWP_FACILITIES.FACILITY_MANUFACTURE': this.state.FACILITY_MANUFACTURE
                ? this.state.FACILITY_MANUFACTURE
                : '',
            'OWP_FACILITIES.FACILITY_MANUF_COUNTRY': this.state.FACILITY_MANUF_COUNTRY
                ? this.state.FACILITY_MANUF_COUNTRY
                : '',
            'OWP_FACILITIES.FACILITY_MODEL_NAME': this.state.FACILITY_MODEL_NAME
                ? this.state.FACILITY_MODEL_NAME
                : '',
            'OWP_FACILITIES.FACILITY_SERIAL_NO': this.state.FACILITY_SERIAL_NO
                ? this.state.FACILITY_SERIAL_NO
                : '',
            'OWP_FACILITIES.FACILITY_ASSET_NO': this.state.FACILITY_ASSET_NO
                ? this.state.FACILITY_ASSET_NO
                : '',
            'OWP_FACILITIES.FACILITY_PURCHASE_AMT': this.state.FACILITY_PURCHASE_AMT
                ? this.state.FACILITY_PURCHASE_AMT
                : '',
            'OWP_FACILITIES.FACILITY_CAPACITY': this.state.FACILITY_CAPACITY
                ? this.state.FACILITY_CAPACITY
                : '',
            'OWP_FACILITIES.FACILITY_TYPE': this.state.FACILITY_TYPE
                ? this.state.FACILITY_TYPE
                : '',
            'OWP_FACILITIES.FACILITY_MATERIAL': this.state.FACILITY_MATERIAL
                ? this.state.FACILITY_MATERIAL
                : '',
            'OWP_FACILITIES.FACILITY_CAPACITY_KW': this.state.FACILITY_CAPACITY_KW
                ? this.state.FACILITY_CAPACITY_KW + ''
                : '',
            'OWP_FACILITIES.FACILITY_CHECK_CYCLE': this.state.FACILITY_CHECK_CYCLE
                ? this.state.FACILITY_CHECK_CYCLE
                : '',

            'OWP_FACILITIES.FACILITY_PURCHASE_DATE': this.state.FACILITY_PURCHASE_DATE
                ? getMomentDateFromDate(this.state.FACILITY_PURCHASE_DATE)
                : '',
            'OWP_FACILITIES.FACILITY_YEAR_MONTH': this.state.FACILITY_YEAR_MONTH
                ? fillMissingDateValue(this.state.FACILITY_YEAR_MONTH)
                : '',
            'OWP_FACILITIES.FACILITY_MT_FREQUENCY': this.state.FACILITY_YEAR_MONTH
                ? getMomentDateFromDate(this.state.FACILITY_PURCHASE_DATE)
                : '',
            'OWP_FACILITIES.FACILITY_POWER': this.state.FACILITY_POWER
                ? this.state.FACILITY_POWER
                : '',
            'OWP_FACILITIES.IMAGE_LINK': this.state.FACILITY_IMAGE,
            'OWP_FACILITIES.FLOOR_PLAN_FILESEQ': floorPlanFileSeq,
            //TODO:clear this dummy when done
        };
        console.log(data);

        const result = await mutate({
            url: '/createOwpFacilitiesWithImages',
            data,
        }).then((res) => {
            console.log(res);
            const G = TGEvent.getGridByID('C0801000');
            G.ReloadBody();
            //this.dialogClose();
            this.closeDialogCheck();
        });
    };

    //TODO:move this service to backend
    onUpdateImageLink = async (type, FACILITY_SEQ) => {
        if (this.state.images) {
            let i = 0;
            for (i = 0; i < this.state.FACILITY_IMAGE.length; i++) {
                const data = {
                    cudtype: 'create',
                    'OWP_FACILITY_FILE_LINK.FILESEQ': this.state.FACILITY_IMAGE[i].fileSeq,
                    'OWP_FACILITY_FILE_LINK.FACILITY_SEQ': FACILITY_SEQ,
                };

                const result = await mutate({
                    url: '/createOwpFacilityFileLink',
                    data,
                }).then((res) => {
                    console.log(res);
                });
            }
        }
        const G = TGEvent.getGridByID('C0801000');
        G.ReloadBody();
        //this.dialogClose();
        this.closeDialogCheck();
    };

    render() {
        return (
            <OwpDialog
                title={
                    <div className="pt-0 mt-0 pb-0 mb-0 w-full flex justify-between items-center">
                        <div>설비.장비 등록</div>
                        <div style={{ right: '150px', position: 'absolute' }}></div>
                        <div>
                            <OwpButton color="secondary" variant="contained">
                                EXCEL 업로드
                            </OwpButton>
                        </div>
                    </div>
                }
                callbackFunction={this.createDialogOpen}
                dialogButton="등록"
                dialogActions={
                    <React.Fragment>
                        <div className="w-full center">
                            <OwpButton
                                color="secondary"
                                variant="contained"
                                onClick={this.openDialogCheck}
                            >
                                저장
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
                                        onClick={this.clickCreate}
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
                                            <OwpTextField
                                                className="w-full"
                                                id="FACILITY_NAME"
                                                name="FACILITY_NAME"
                                                value={this.state.FACILITY_NAME}
                                                onChange={this.handleChange}
                                            />
                                        </td>
                                        <th className="center" width="120">
                                            설비번호
                                        </th>
                                        <td className="center">
                                            <OwpTextField
                                                style={{ width: '100%' }}
                                                id="FACILITY_ID"
                                                name="FACILITY_ID"
                                                value={this.state.FACILITY_ID}
                                                onChange={this.handleChange}
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
                                                useAll={false}
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
                                            {/* <OwpSearchDateField
                                                type="month"
                                                name="FACILITY_YEAR_MONTH"
                                                id="FACILITY_YEAR_MONTH"
                                                value={this.state.FACILITY_YEAR_MONTH}
                                                onChange={this.handleChange}
                                                initNow={true}
                                            /> */}
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
                                                // value={this.state.FACILITY_PURCHASE_DATE}
                                                onChange={this.handleChange}
                                                initNow={true}
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
                                                useAll={false}
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

export default DialogReweighing;

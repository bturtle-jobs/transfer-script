import React, { Component } from 'react';
import {
    OwpButton,
    OwpSearchDateTimePickerMulti,
    OwpPageCarded,
    OwpSearchHeader,
    OwpSearchSelectField,
    OwpSearchTextField,
    OwpToolbar,
    OwpTreeGrid,
    OwpSearchAutoComplete,
    OwpSession,
    OwpSelectField,
} from 'owp/wrapper';
import * as TGEvent from 'owp/TGEvent';
import { saveGridSelect } from 'main/GridUtill';
import Pop_C0801001 from '../../include/Pop_C0801001';
import Pop_C0801002 from '../../include/Pop_C0801002';

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.Pop_C0801002 = React.createRef();
    }

    componentDidMount() {
        TGEvent.OWPTGSelect('C0801000', (is, row) => {
            //TODO question here
            saveGridSelect('C0801000', 'OWP_FACILITIES.FACILITY_SEQ');
            if (is) {
                this.setState((state) => {
                    return { FACILITY_SEQ: row['OWP_FACILITIES.FACILITY_SEQ'] };
                });
            } else {
                this.setState((state) => {
                    return { FACILITY_SEQ: null };
                });
            }
        });

        const _show = this.showPop_C0801002;

        window.TGSetEvent('OnClick', 'C0801000', function (grid, row, col, val, bool, event) {
            console.log('click');
            event.preventDefault();
            if (col === 'DETAIL' && row.Kind === 'Data') {
                console.log('row');
                _show(row);
            }
        });
    }

    showPop_C0801002 = (row) => {
        if (row['OWP_FACILITIES.FACILITY_SEQ']) {
            this.setState((state) => {
                return { FACILITY_SEQ: row['OWP_FACILITIES.FACILITY_SEQ'] };
            });

            this.Pop_C0801002.onDialogOpen();
            return true;
        } else {
            return false;
        }
    };

    render() {
        return (
            <React.Fragment>
                <OwpPageCarded
                    header={
                        <OwpSearchHeader url="listOwpFacilitiesInC0801000">
                            <OwpSearchTextField
                                className="w-160"
                                id={'sm01'}
                                name={'OWP_FACILITIES.FACILITY_ID'}
                                label={'설비번호'}
                            />

                            <OwpSearchTextField
                                className="w-160"
                                id={'sm03'}
                                name={'OWP_FACILITIES.FACILITY_NAME'}
                                label={'설비명'}
                            />
                            <OwpSearchSelectField
                                className="w-160"
                                id={'OWP_FACILITIES.LOCATION_CD'}
                                name={'OWP_FACILITIES.LOCATION_CD'}
                                label="설치장소"
                                groupId={'D801100'}
                                useAll
                            />
                            <OwpSearchSelectField
                                className="w-160"
                                id={'OWP_FACILITIES.LEVEL_CD'}
                                name={'OWP_FACILITIES.LEVEL_CD'}
                                label="설비등급"
                                useAll
                                groupId={'D801200'}
                            />

                            <OwpSearchDateTimePickerMulti
                                name="OWP_FACILITIES.FACILITY_MT_FREQUENCY"
                                initNow={true} // TODO: true 인 경우 현재 시로 init (* default = false)
                                labels={{ start: ' 등록시작일', end: '종료일' }}
                                inputProps={{
                                    start: { style: { width: 140 } },
                                    end: { style: { width: 140 } },
                                }}
                                required={true}
                            />

                            {/*Hidden 필수 값*/}
                            {/* <OwpSearchTextField
                                className="hidden"
                                name="OWP_PRODPLAN.PLAN_TYPE"
                                value="D006002"
                            /> */}
                        </OwpSearchHeader>
                    }
                    contentToolbar={
                        <OwpToolbar title="설비/장비 관리">
                            <Pop_C0801001 />
                            {/* modify pop up */}
                            <Pop_C0801002
                                FACILITY_SEQ={this.state.FACILITY_SEQ}
                                innerRef={(ref) => {
                                    this.Pop_C0801002 = ref;
                                }}
                            />
                            <OwpButton color={'secondary'} variant={'contained'}>
                                삭제
                            </OwpButton>
                        </OwpToolbar>
                    }
                    content={
                        <React.Fragment>
                            {/* <Pop_C0801002
                                isDialogOpen={this.state.isDialogOpen}
                                FACILITY_SEQ={this.state.FACILITY_SEQ}
                                innerRef={(ref) => {
                                    console.log(`Set ref`);
                                    console.log(this.Pop_C0801002);
                                    console.log(ref);
                                    this.Pop_C0801002 = ref;
                                }}
                            /> */}
                            <OwpTreeGrid
                                id="C0801000"
                                LayoutUrl={'/assets/data/C0801000Def.xml'}
                                // DataUrl={'/assets/data/C0202000Data.xml'}
                            />
                        </React.Fragment>
                    }
                    innerScroll
                />
            </React.Fragment>
        );
    }
}

export default Page;

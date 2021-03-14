import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import moment from 'moment';
import { mutate } from 'owp/api';
import { getAccessToken } from 'owp/auth';
import { validateRestApiResponse } from 'owp/common';
import { changesAsJSON } from 'owp/components/TreeGrid/util';
import { OwpMessage, OwpSession } from 'owp/wrapper';
import XLSX from 'xlsx';
import { font } from './SpoqaHanSansRegular-normal';

//import {setNetworkStatus} from "store/actions";

export const getGridByID = function (gridId) {
    const G = window.GetGrids();

    for (let i = 0; i < G.length; i++) {
        //console.log('GetGrids ',i,gridId,G);
        if (G[i].Data.id === gridId) {
            return G[i];
        }
    }
    return null;
};

export const OWPTGDataList = function (gridId, restAPI, obj, obj2, obj3, obj4) {
    let G;
    let intervalCnt = 0;
    let interval;

    interval = setInterval(() => {
        G = getGridByID(gridId);
        intervalCnt++;
        if (G) {
            clearInterval(interval);
            _OWPTGDataList(G, restAPI, obj, obj2, obj3, obj4);
            //console.log('1. clearInterval getGridByID ',gridId,intervalCnt);
        } else {
            if (intervalCnt > 10) {
                clearInterval(interval);
                //console.log('2. clearInterval getGridByID ',gridId,intervalCnt);
            } else {
                //console.log('3. retry getGridByID ',gridId,intervalCnt);
            }
        }
    }, 1500);
};

const _OWPTGDataList = function (G, restAPI, obj, obj2, obj3, obj4) {
    //console.log('OWPTGDataList',G);
    const jsonData = _.merge({}, obj, obj2, obj3, obj4, { VER: '2' });
    if (G) {
        G.Data.Data.Url =
            process.env.REACT_APP_REST_API_URL +
            '/' +
            restAPI +
            '?jsondata=' +
            encodeURI(JSON.stringify(jsonData)) +
            'DUMMY=' +
            Math.random() * 2.0 * Math.PI +
            '&TOKEN=' +
            getAccessToken();
        G.ReloadBody();
        G.ClearSelection();
        // window.Grids.OnDataSend = function (G, source, data, Func) {
        //     console.log('_OWPTGDataList OnDataSend : ',data);
        //     //_dispatch(setNetworkStatus('START'));
        // }
    }
};

export const OWPTGDelEvent = function () {
    console.log('OWPTGDelEvent');
    window.TGDelEvent();
};

let isOnSelect = false;
export const OWPTGSelect = function (gridId, callbackfunc) {
    window.TGSetEvent('OnSelect', gridId, function (G, row) {
        if (!isOnSelect) {
            //console.log('OWPTGSelect',gridId);
            isOnSelect = true;
            setTimeout(function () {
                const rowCount = G.GetSelRows().length;

                if (rowCount > 0) {
                    callbackfunc(true, row);
                } else {
                    callbackfunc(false);
                }

                isOnSelect = false;
            }, 300);
        }
    });
};

export const OWPTGDelete = function (gridId, restAPI, rowID, callbackfunc = _.noop) {
    //console.log(gridId,restAPI,rowID);
    const G = getGridByID(gridId);

    const rowCount = G.GetSelRows().length;

    if (rowCount > 0) {
        G.GetSelRows().map((row, i) => {
            console.log(row[rowID]);
            mutate({
                url: restAPI + '/' + row[rowID],
            })
                .then((res) => {
                    console.log('ResultData...', res);
                    G.RemoveRow(row);
                    callbackfunc(res);
                })
                .catch((error) => console.error(error));
        });
    } else {
        OwpMessage({
            message: '선택 한 행이 없습니다.', //text or html
            variant: 'warning', //success error info warning null
        });
    }
};

export const OWPTGAddRow = function (gridId, callbackfunc = _.noop, islast) {
    //console.log('OWPTGAddRow girdId',gridId);

    //const G = window.GetGrids(girdId)[0];
    const G = getGridByID(gridId);

    let par;
    /*
    islast
    true // 밑으로 데이터 추가
    false // 위로 데이터 추가
    */
    if (islast) {
        // 그리드에 데이터가 있을 경우 마지막 데이터 하단에 Insert
        if (G.RowCount > 0) {
            par = G.GetNext(G.GetLast(null), G.RowCount + 1);

            // 그리드 데이터가 없을 경우
        } else {
            par = G.GetLast(null);
        }
    } else {
        par = G.GetFirst(null);
    }
    //G.AddRow(par,G.GetSelRows()[0],1);
    const R = G.AddRow(par, par, 1);

    R.CanEdit = 1;

    callbackfunc(R);
};

export const OWPTGUpdateRow = function (gridId, callbackfunc = _.noop) {
    //console.log('OWPTGAddRow girdId',gridId);

    const G = getGridByID(gridId);

    const R = G.GetSelRows()[0];

    R.CanEdit = 1;

    callbackfunc(R);
};

export const OWPTGCopyRow = function (gridId, callbackfunc = _.noop) {
    //console.log('OWPTGCopyRow girdId',gridId);

    //const G = window.GetGrids(girdId)[0];
    const G = getGridByID(gridId);

    const R = G.CopyRow(G.GetSelRows()[0], G.GetSelRows()[0]);

    R.CanEdit = 1;

    callbackfunc(R);
};

export const OWPTGSave = function (gridId, restAPI, format, callbackfunc = _.noop) {
    const G = getGridByID(gridId);

    const _rows = Object.values(G['Rows']);

    const _format = format;

    _rows
        .filter((item) => item.Kind == 'Data')
        .map((row) => {
            if (row['Added'] == 1 || row['Changed'] == 1) {
                //console.log("_format...", _format,row);

                let data = _format;

                Object.keys(_format)
                    .filter((key) => _format[key] === null)
                    .map((_key) => {
                        //console.log(_key,"row[_key]...", row[_key]);
                        data[_key] = row[_key] ? '' + row[_key] : '';
                    });

                //data['TOKEN'] = getAccessToken();
                //console.log("data...", data);

                mutate({
                    url: restAPI, //+"?TOKEN="+getAccessToken()
                    data,
                })
                    .then((res) => {
                        G.ReloadBody();
                        console.log('ResultData...', res);
                        callbackfunc();
                    })
                    .catch((error) => console.error(error));
            }
        });
};

export const OWPTGSaveMulti = async function (
    gridId,
    options = {
        createApiUrl: '',
        updateApiUrl: '',
        integrateApiUrl: '',
        useDefaultuserSeq: false,
        userSeqKeyName: '',
        additionalDatakeysOnUpdate: [],
        requiredProps: {},
    }
) {
    try {
        if (!gridId) {
            throw new Error('TreeGrid Id 는 필수 입니다.');
        }

        const gridInstance = getGridByID(gridId);

        if (_.isEmpty(gridInstance)) {
            throw new Error('TreeGrid 인스턴스가 없습니다.');
        }

        const changesData = changesAsJSON(gridInstance.GetXmlData('changes,nogrid,noio'));

        if (!_.isEmpty(changesData)) {
            const userSeqKeyName = _.get(options, 'userSeqKeyName');
            const useDefaultuserSeq = _.get(options, 'useDefaultuserSeq');
            const requiredProps = _.get(options, 'requiredProps', {});
            const additionalDatakeysOnUpdate = _.get(options, 'additionalDatakeysOnUpdate', []);

            const userSeq = useDefaultuserSeq ? 'Y' : OwpSession(userSeqKeyName || 'UserSEQ');

            const addedData = changesData
                .filter((data) => _.get(data, 'Added') === '1')
                .map((addedData) => {
                    return {
                        STATUS: 'create',
                        ...addedData,
                        ...(!!userSeqKeyName &&
                            !_.isEmpty(userSeq) && { [userSeqKeyName]: userSeq }),
                        ...(_.isObject(requiredProps) ? requiredProps : {}),
                    };
                });

            const changedData = changesData
                .filter((data) => _.get(data, 'Changed') === '1')
                .map(({ id, ...restChangedData }) => {
                    const _row = _.get(gridInstance, `Rows.${id}`);

                    return {
                        STATUS: 'update',
                        [_.get(gridInstance, 'IdNames.0', 'id')]: id,
                        ...restChangedData,
                        ...(!_.isEmpty(additionalDatakeysOnUpdate) &&
                            !_.isEmpty(_row) &&
                            Object.fromEntries(
                                additionalDatakeysOnUpdate
                                    .map((key) => {
                                        const _value = _.get(_row, key);
                                        if (_.isNil(_value)) {
                                            return null;
                                        }
                                        return [key, _value];
                                    })
                                    .filter((node) => !!node)
                            )),
                        ...(!!userSeqKeyName &&
                            !_.isEmpty(userSeq) && { [userSeqKeyName]: userSeq }),
                        ...(_.isObject(requiredProps) ? requiredProps : {}),
                    };
                });

            const integrateApiUrl = _.get(options, 'integrateApiUrl');

            if (!_.isEmpty(integrateApiUrl)) {
                const result = await mutate({
                    url: integrateApiUrl,
                    data: [...addedData, ...changedData],
                });

                if (validateRestApiResponse(result)) {
                    gridInstance.ReloadBody();
                }

                return result;
            }

            let canNext = false;
            return Promise.all(
                [
                    { url: _.get(options, 'createApiUrl'), data: addedData, nextFlag: canNext },
                    { url: _.get(options, 'updateApiUrl'), data: changedData, nextFlag: !canNext },
                ].map(async ({ url, data, nextFlag }, index) => {
                    const result =
                        !_.isEmpty(data) && !!url && canNext === nextFlag
                            ? await mutate({
                                  url,
                                  data,
                              })
                            : data;

                    if (index === 0 && !canNext) {
                        canNext = !canNext;
                    } else if (index === 1 && canNext && validateRestApiResponse(result)) {
                        gridInstance.ReloadBody();
                    }

                    return result;
                })
            );
        }

        console.error('변경할 데이터 없음.');
        return false;
    } catch (error) {
        console.error(error);
    }
};

export const OWPTGExport = function (gridId, callbackfunc = _.noop) {
    const G = getGridByID(gridId);
    //G.SaveExport("export");

    //const x = document.getElementsByClassName("TSToolExport");
    //const x = document.getElementsByClassName(" TSToolbarRow TSSolidRow");
    //const x = document.getElementsByClassName("TSCellSpaceButton TSType TSButton TSToolHtmlIconSingle TSToolExport1 TSToolAlignSingle TSToolHtmlBase TSToolHtmlIcon1 TSWrap0 TSCellSpaceBase");
    const x = document.querySelectorAll(
        'td.TSCellSpaceButton.TSType.TSButton.TSToolHtmlIconSingle.TSToolExport.TSToolAlignSingle.TSToolHtmlBase.TSToolHtmlIcon.TSWrap0.TSCellSpaceBase'
    );
    for (let i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = 'red';

        console.log(x[i]);

        //triggerEvent(x[i], 'mouseover');
        //triggerEvent(x[i], 'mousedown');
        //triggerEvent(x[i], 'mouseup');
        //triggerEvent(x[i], 'click');

        //x[i].addEventListener("click", callbackfunc);
    }

    // window.GetGrids.OnMouseDown = function(G,row,col,x,y,Event){
    //     console.log("OnMouseDown: Cell ["+(row?row.id:null)+","+col+"] at ["+x+","+y+"].",1);
    // }

    // const G = window.GetGrids(girdId)[0];
    //
    // //console.log('OWPTGExport',G.Data);
    //
    // const element = document.querySelectorAll('.TSToolExport1')[0];// element.click();
};

export const OWPTGExportExcel = (
    gridId = '',
    options = {
        useAppendCurrentDateToExportName: false,
        useAppendCurrentDateTimeToExportName: false,
        exportName: '',
        exportType: '',
        exportFontSize: 12,
    }
) => {
    try {
        if (!gridId) {
            throw new Error('TreeGrid Id 는 필수 입니다.');
        }

        const gridInstance = getGridByID(gridId);

        if (_.isEmpty(gridInstance)) {
            throw new Error('TreeGrid 인스턴스가 없습니다.');
        }

        const exportType = _.get(options, 'exportType', '');
        const exportName = _.get(options, 'exportName', gridInstance.ExportName || gridId);
        const exportFontSize = _.get(options, 'exportFontSize', 12);

        const useAppendCurrentDateToExportName = _.get(
            options,
            'useAppendCurrentDateToExportName',
            false
        );
        const useAppendCurrentDateTimeToExportName = _.get(
            options,
            'useAppendCurrentDateTimeToExportName',
            false
        );

        gridInstance.ExportName = `${exportName}${
            useAppendCurrentDateTimeToExportName
                ? `-${moment().format('YYYY-MM-DD-HH-mm-ss')}`
                : useAppendCurrentDateToExportName
                ? `-${moment().format('YYYY-MM-DD')}`
                : ''
        }`;
        gridInstance.ExportFormat = 'xlsx';
        gridInstance.ExportType = !!gridInstance.ExportType
            ? `${gridInstance.ExportType},Hidden,Hide,TextType${
                  !!exportType ? `,${exportType}` : ''
              }`
            : `Hidden,Hide,TextType${!!exportType ? `,${exportType}` : ''}`;
        gridInstance.ExportFontSize = exportFontSize;
        gridInstance.ExportCols = 0;
        gridInstance.ExportVarHeight = 0;

        gridInstance.ActionExport();
    } catch (error) {
        console.error(error);
    }
};

export const OWPTGExportExcelToSubject = function (gridId, title, callbackfunc) {
    const G = getGridByID(gridId);

    let cols = [];
    let headers = [];
    let body = [];

    G.GetCols('Visible', 'CanExport').map((col, i) => {
        cols.push(col);
        headers.push(G.Rows.Header[col]);
    });
    body.push(headers);

    const _rows = Object.values(G['Rows']);
    _rows
        .filter((item) => item.Kind == 'Data')
        .map((row) => {
            let _rowdata = [];
            cols.map((col, i) => {
                //console.log('cols-->col',row[col]);
                _rowdata.push(row[col]);
            });
            body.push(_rowdata);
        });

    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(body);

    const wscols = [{ wpx: 300 }];
    sheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(book, sheet, 'sheet1');
    XLSX.writeFile(book, `${title}.xls`);
};

function getAllSiblings(sibling, leng, arr) {
    if (leng && sibling) {
        arr.push(sibling);
        getAllSiblings(sibling.nextSibling, --leng, arr);
    }

    return arr;
}

export const OWPTGExportExcelToSubjectByPageNo = function (gridId, title, pageNo = 0) {
    const G = getGridByID(gridId);

    let cols = [];
    let headers = [];
    let body = [];

    G.GetCols('Visible', 'CanExport').map((col, i) => {
        cols.push(col);
        headers.push(G.Rows.Header[col]);
    });
    body.push(headers);

    const target = G.GetPage(pageNo);

    const _rows = getAllSiblings(target.firstChild, target.childNodes.length, [target.firstChild]);
    _rows
        .filter((item) => item.Kind == 'Data')
        .map((row) => {
            let _rowdata = [];
            cols.map((col, i) => {
                //console.log('cols-->col',row[col]);
                _rowdata.push(row[col]);
            });
            body.push(_rowdata);
        });

    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(body);

    const wscols = [{ wpx: 300 }];
    sheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(book, sheet, 'sheet1');
    XLSX.writeFile(book, `${title}.xls`);
};

export const OWPTGExportPDF = function (gridId, callbackfunc = _.noop) {
    const G = getGridByID(gridId);

    //G.SaveExport("export");
    //console.log(G.Data.Layout.Url);
    //console.log(G.Rows);
    //console.log(G.Def);
    //console.log(G.GetCols("Visible","CanExport"));

    //let headerName = [];
    let headers = [];
    let body = [];

    G.GetCols('Visible', 'CanExport').map((col, i) => {
        //headerName.push(G.Rows.Header[col]);
        headers.push({
            dataKey: col,
            title: G.Rows.Header[col],
        });
    });

    const _rows = Object.values(G['Rows']);
    _rows
        .filter((item) => item.Kind == 'Data')
        .map((row) => {
            let _rowdata = {};
            G.GetCols('Visible', 'CanExport').map((col, i) => {
                _rowdata[col] = row[col];
            });
            body.push(_rowdata);
        });

    //console.log('headers',headers);
    //console.log('body',body);

    const doc = new jsPDF('landscape', 'mm', 'a4');

    doc.addFileToVFS('SpoqaHanSansRegular-normal.ttf', font);
    doc.addFont('SpoqaHanSansRegular-normal.ttf', 'SpoqaHanSansRegular', 'normal');
    doc.setFont('SpoqaHanSansRegular');

    doc.autoTable(headers, body, {
        theme: 'grid',

        styles: {
            fontSize: 8,

            font: 'SpoqaHanSansRegular',

            fontStyle: 'normal',
        },

        headerStyles: {
            fontSize: 8,

            font: 'SpoqaHanSansRegular',

            fontStyle: 'normal',
        },
    });

    doc.setProperties({
        title: gridId,
    });

    doc.setFontSize(8);
    //doc.table(1, 1, body, headers, { autoSize: true });
    doc.save(gridId + '.pdf');

    //alert('OWPTGExportPDF');
};

const onDelete = async (url) => {
    const result = await mutate({
        url: url,
        timeout: 60000,
    })
        .then((res) => {
            console.log('ResultData...', res);
        })
        .catch((error) => console.error(error));
};

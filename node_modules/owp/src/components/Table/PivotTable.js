import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { showMessage } from 'owp/common';
import { FileDndZone, SelectTextField } from 'owp/components';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-pivottable/pivottable.css';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import XLSX from 'xlsx';

// constants
const ACCEPT = '.xlsx, .xlsb, .xlsm, .xls';
const ERROR_MESSAGES = {
    warning: {
        message: '올바른 XLSX 형식이 아닙니다.',
        variant: 'warning',
    },
    error: {
        message: 'XLSX 파일 로드를 실패했습니다.',
        variant: 'error',
    },
    empty: {
        message: '로드할 데이터가 없습니다.',
        variant: 'warning',
    },
};

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);

// regarding xlsx to json
const readXlsx = (data, options = {}) =>
    new Promise((resolve, reject) => {
        if (!data || !data instanceof Blob || data.type === 'text/html') {
            showMessage(ERROR_MESSAGES.error);
            reject(data);
            return;
        }
        const reader = new FileReader();
        const canRABS = !!options.canRABS || !!reader.readAsBinaryString;

        reader.onabort = (error) => {
            showMessage(ERROR_MESSAGES.warning);
            reject(error);
        };

        reader.onerror = (error) => {
            showMessage(ERROR_MESSAGES.error);
            reject(error);
        };

        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {
                type: canRABS ? 'binary' : 'array',
                cellDates: true,
                cellNF: false,
                cellText: false,
            });

            resolve(wb);
        };

        if (canRABS) {
            reader.readAsBinaryString(data);
        } else {
            reader.readAsArrayBuffer(data);
        }
    });

const makeSheetToJson = ({ data, name } = {}, options = {}) => {
    if (!!data) {
        const convertedData = XLSX.utils.sheet_to_json(data, {
            raw: false,
            ...options,
        });

        if (Array.isArray(convertedData) && !isEmpty(convertedData)) {
            showMessage({
                message: `${name} 시트를 성공적으로 로드 했습니다.`,
                variant: 'success',
            });
            return convertedData;
        }
    }

    showMessage(ERROR_MESSAGES.empty);

    return [];
};

const readXlsxFromDataURL = (dataURL) =>
    new Promise((resolve, reject) => {
        if (ACCEPT.indexOf(last(last(dataURL.split('/')).split('.')).toLowerCase()) === -1) {
            showMessage(ERROR_MESSAGES.warning);
            reject(ERROR_MESSAGES.warning);
            return;
        }

        axios({
            method: 'get',
            url: dataURL,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            responseType: 'blob',
            ...(dataURL.indexOf('http') === -1 && {
                baseURL: window.location.origin,
            }),
        })
            .then(({ data } = {}) =>
                readXlsx(data, { canRABS: true })
                    .then((xlsxData) => resolve(xlsxData))
                    .catch((error) => reject(error))
            )
            .catch((error) => reject(error));
    });

const PivotTable = ({
    sheetSelectProps,
    sheetOptions,
    dropZoneProps,
    dataURL,
    data,
    pivotTableOnly,
    ...restProps
}) => {
    const [pivotTableData, setPivotTableData] = useState([]);
    const [sheetData, setSheetData] = useState({});
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheetName, setSelectedSheetName] = useState(0);

    const preparePivotTableData = (xlsxData = {}) => {
        // Set sheets
        setSheetData(xlsxData.Sheets);

        // Set worksheet names
        setSheetNames(xlsxData.SheetNames);

        // Get first sheet name
        const sheetName = xlsxData.SheetNames[0];
        setSelectedSheetName(sheetName);

        // Set first sheet
        setPivotTableData(
            makeSheetToJson(
                {
                    data: xlsxData.Sheets[sheetName],
                    name: sheetName,
                },
                sheetOptions
            )
        );
    };

    useEffect(() => {
        if (dataURL && isEmpty(data)) {
            readXlsxFromDataURL(dataURL)
                .then((xlsxData) => preparePivotTableData(xlsxData))
                .catch((error) => console.error(error));
            return;
        }

        if (!isEmpty(data) && Array.isArray(data)) {
            setPivotTableData(data);
        }
    }, [dataURL, data]);

    const handleChangeFiles = useCallback((nextFiles) => {
        if (isEmpty(nextFiles)) {
            showMessage(ERROR_MESSAGES.warning);
            return;
        }

        const acceptedFile = nextFiles[0];

        readXlsx(acceptedFile)
            .then((xlsxData) => preparePivotTableData(xlsxData))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="justify-center mx-8 my-8" {...restProps}>
            {!pivotTableOnly && isEmpty(dataURL) && isEmpty(data) && (
                <FileDndZone
                    className="my-8"
                    style={{ width: '100%', height: 80 }}
                    {...dropZoneProps}
                    useClickButtonEvent
                    multiple={false}
                    accept={ACCEPT}
                    onDrop={handleChangeFiles}
                    onChange={handleChangeFiles}
                />
            )}
            {!pivotTableOnly && !isEmpty(sheetNames) && sheetNames.length > 1 && (
                <SelectTextField
                    className="my-8"
                    {...sheetSelectProps}
                    value={selectedSheetName}
                    items={sheetNames.map((name) => ({
                        label: name,
                        value: name,
                    }))}
                    onChange={(sheetName) => {
                        setSelectedSheetName(sheetName);
                        setPivotTableData(
                            makeSheetToJson(
                                {
                                    data: sheetData[sheetName],
                                    name: sheetName,
                                },
                                sheetOptions
                            )
                        );
                    }}
                />
            )}
            <div className="flex flex-col">
                <PivotTableUI
                    data={pivotTableData}
                    onChange={(nextData) => setPivotTableData(nextData)}
                    renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                    {...pivotTableData}
                />
            </div>
        </div>
    );
};

PivotTable.propTypes = {
    /**
     * Drop Zone props
     */
    dropZoneProps: PropTypes.object,
    /**
     * Sheet 가 N개인 경우 Select Props
     */
    sheetSelectProps: PropTypes.object,
    /**
     * sheet option
     * @link https://github.com/SheetJS/js-xlsx#json
     */
    sheetOptions: PropTypes.object,
    /**
     * url 을 설정하면 DropZone 은 비활성화됨. domain origin 포함 가능.
     */
    dataURL: PropTypes.string,
    /**
     * pivot table 데이터. 셋팅 시 DropZone 은 비활성화됨.
     * @link https://github.com/plotly/react-pivottable#accepted-formats-for-data
     */
    data: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number])
    ),
    /**
     * @ignore
     */
    pivotTableOnly: PropTypes.bool,
};

PivotTable.defaultProps = {
    dropZoneProps: { label: 'XLSX 파일을 끌어놓거나 클릭하여 선택해주세요.' },
    sheetSelectProps: { label: 'EXCEL SHEET', fullWidth: true },
    sheetOptions: { dateNF: 'yyyy/mm/dd hh:mm' },
    dataURL: null,
    data: [],
    pivotTableOnly: false,
};

export default PivotTable;

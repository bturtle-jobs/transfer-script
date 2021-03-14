import { Button } from '@material-ui/core';
import * as FileSaver from 'file-saver';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import * as XLSX from 'xlsx';
import OwpMessage from './OwpMessage';

const FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const FILE_EXTENTION = 'xlsx';

const makePivot = (label, data = []) => [
    ...(!isEmpty(label)
        ? [...Object.keys(label), ''].map((key, i) => ({ 0: key, 1: trim(get(label, key, '')) }))
        : []),
    ...(Object.keys(get(data, 0, {})) || []).map(key => ({
        0: key,
        ...Object.fromEntries(data.map((item, i) => [i + 1, trim(get(item, key, ''))])),
    })),
];

const makeWorkBook = (data = []) => {
    const workSheets = data.map(
        ({ label, data: childData = [], cols = [], sheetName, usePivot = false } = {}) => {
            const transformData = childData.map(item =>
                isEmpty(cols)
                    ? item
                    : Object.fromEntries(
                          cols.map(({ key = '', value = '' } = {}) => [
                              [trim(value || key).replace(/ /g, '_')],
                              trim(get(item, key, '')),
                          ])
                      )
            );

            return XLSX.utils.json_to_sheet(
                usePivot ? makePivot(label, transformData) : transformData,
                {
                    skipHeader: usePivot,
                }
            );
        }
    );

    const sheetNames = data.map(({ sheetName = '' } = {}, i) => sheetName || `sheet${i + 1}`);

    return {
        Sheets: Object.fromEntries(workSheets.map((sheet, i) => [get(sheetNames, i), sheet])),
        SheetNames: sheetNames,
    };
};

const exportToXlsx = (data, fileName) => () => {
    try {
        if (isEmpty(data)) {
            OwpMessage({
                message: 'Excel 로 변환할 데이터가 없습니다.',
                variant: 'warning',
            });
            return;
        }
        const bufferData = XLSX.write(makeWorkBook(data), {
            bookType: 'xlsx',
            type: 'array',
        });
        const blobData = new Blob([bufferData], { type: FILE_TYPE });

        FileSaver.saveAs(blobData, `${fileName}.${FILE_EXTENTION}`);
    } catch (error) {
        console.error(error);
    }
};

const OwpExportDataToExcelButton = ({ data, fileName, title, useAddTimeToFile, ...restProps }) => {
    return (
        <Button
            {...restProps}
            onClick={exportToXlsx(
                data,
                useAddTimeToFile
                    ? `${fileName}_${moment().format('YYYY-MM-DD-HH-mm-ss')}`
                    : fileName
            )}
        >
            {title}
        </Button>
    );
};

OwpExportDataToExcelButton.propTypes = {
    data: PropTypes.array.isRequired,
    fileName: PropTypes.string,
    title: PropTypes.string,
    useAddTimeToFile: PropTypes.bool,
};

OwpExportDataToExcelButton.defaultProps = {
    data: [],
    fileName: 'excel',
    title: 'Excel 로 내보내기',
    useAddTimeToFile: true,
};

export default OwpExportDataToExcelButton;

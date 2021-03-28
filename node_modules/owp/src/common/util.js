import debounce from 'lodash/debounce';
import every from 'lodash/every';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import throttle from 'lodash/throttle';
import moment from 'moment';
import { query } from 'owp/api';
import { setCommonCodeData } from 'owp/auth/store/actions';
import store from 'owp/store';
import * as Actions from 'owp/store/actions';

const REST_API_SUCCESS_MESSAGE = ['처리되었습니다.', '수정되었습니다.', '등록되었습니다.'];
const REST_API_SUCCESS_RESULT_CODE = ['STATUS_1'];

const DATE_LENGTH_COUNTS = [
    'YYYY'.length,
    'YYYY-MM'.length,
    'YYYYMM'.length,
    'YYYY-MM-DD'.length,
    'YYYYMMDD'.length,
    'YYYY-MM-DD HH:mm'.length,
    'YYYY-MM-DD HH:mm:ss'.length,
];

const _dispatch = throttle((action) => {
    store.dispatch(action);
}, 1000);

export function showMessage(messageData = {}) {
    store.dispatch(Actions.hideMessage());

    debounce(() => {
        _dispatch(
            Actions.showMessage({
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
                ...messageData,
            })
        );
    }, 100)();
}

export const setCommonCodes = async (commonCodes) => {
    try {
        if (!isEmpty(commonCodes)) {
            _dispatch(setCommonCodeData(commonCodes));
            return;
        }

        const _commonCodes = await query({
            url: `${process.env.REACT_APP_REST_API_URL}/listIPX_CommonCodeTotalAC`,
        });

        _dispatch(setCommonCodeData(_commonCodes));
    } catch (error) {
        console.error(error);
    }
};

export const isJSON = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

export const sortByTarget = (target = [], path = '') => (a, b) =>
    target.indexOf(get(a, path, a)) - target.indexOf(get(b, path, b));

export const convertNumString = (num) => parseInt(num).toString();

export const makeNowYYYY = () => moment().format('YYYY');
export const makeNowYYYYMMDD = (sep = '-') => moment().format(`YYYY${sep}MM${sep}DD`);
export const makeNowYYYYMMDDHHmm = (dateSep = '-', timeSep = ':') =>
    moment().format(`YYYY${dateSep}MM${dateSep}DDTHH${timeSep}mm`);

export const makeNowYYYYMM = (sep = '-') => moment().format(`YYYY${sep}MM`);

export const makeNowHHmm = (sep = ':') => moment().format(`HH${sep}mm`);

export const makeDateObject = (date = '') => {
    if (date instanceof Date) {
        return date;
    }

    if (includes(DATE_LENGTH_COUNTS, date.length)) {
        return new Date(date);
    }

    return new Date();
};

export const makeDateString = (date = '', { separator = '', useKr = true } = {}) => {
    if (!date || !includes(DATE_LENGTH_COUNTS, date.length)) {
        return date;
    }

    const [yyyy, mm, dd] =
        date.indexOf('-') === -1
            ? [date.substring(0, 4), date.substring(4, 6), date.substring(6, 8)]
            : date.split('-');

    return `${yyyy}${useKr ? '년 ' : separator}${
        useKr ? `${convertNumString(mm)}월` : `${mm}${!isEmpty(dd) ? separator : ''}`
    }${!isEmpty(dd) ? (useKr ? ` ${convertNumString(dd)}일` : dd) : ''}`;
};

export const validateRestApiResponse = (res) =>
    every(
        [
            { key: 'resultCode', values: REST_API_SUCCESS_RESULT_CODE },
            { key: 'resultMessage', values: REST_API_SUCCESS_MESSAGE },
        ].map(({ key, values }) => includes(values, get(res, key)))
    );

export const deepKeysByObject = (obj = {}) =>
    Object.keys(obj)
        .filter((key) => obj[key] instanceof Object)
        .map((key) => deepKeysByObject(obj[key]).map((k) => `${key}.${k}`))
        .reduce((x, y) => x.concat(y), Object.keys(obj))
        .filter((key) => !(get(obj, key) instanceof Object));

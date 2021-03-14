import _ from 'lodash';
import { ERROR_REST_API_URL } from 'owp/constants/error';
import qs from 'qs';
import { path } from 'ramda';
import { showMessage } from '../common/util';
import { createAxios } from './axios';
import { getAccessToken } from 'owp/auth';

const statusMap = {
    success: 'STATUS_1',
    error: 'STATUS_0',
};

const _axiosQuery = createAxios({
    method: 'get',
    paramsSerializer: function (params) {
        return qs.stringify(params, { indices: false });
    },
});
_axiosQuery.interceptors.response.use((res) => {
    if (
        _.get(res, 'config.custom.showErrorMessage') &&
        _.get(res, 'data.resultCode') === statusMap.error
    ) {
        showMessage({
            message: _.get(res, 'data.resultMessage', ''),
            variant: 'error',
        });
    }

    return _.isEmpty(_.get(res, 'data.resultData2'))
        ? _.get(res, 'data.resultData', _.get(res, 'data.Body[0]'))
        : _.get(res, 'data');
});

const _axiosMutate = createAxios();
_axiosMutate.interceptors.response.use((res) => {
    const data = path(['data'], res) || {};
    const { resultCode, resultMessage } = data;
    const isSuccess = resultCode === statusMap.success;

    if (resultMessage) {
        showMessage({
            message: resultMessage,
            variant: isSuccess ? 'success' : 'error',
        });
    }

    return isSuccess ? data : Promise.reject(res);
});

// query
/**
 *
 * @param { url, params } object
 * { url: '/restApi', params: { ...getParameter }}
 */
export const query = (
    { url, params = {}, timeout = 10000 } = {},
    { showErrorMessage = true } = {}
) => {
    _axiosQuery.defaults.timeout = timeout;

    params = _.merge(params, { TOKEN: getAccessToken() });

    return !!url
        ? _axiosQuery(encodeURI(url), { params, custom: { showErrorMessage } })
        : Promise.reject(ERROR_REST_API_URL);
};

/**
 *
 * @param {Array} object
 *
 * [{ url, params}, {url, params}...]
 */
export const queryAll = (args = []) => {
    return Array.isArray(args) && args.length
        ? Promise.all(args.map(query))
        : Promise.reject(ERROR_REST_API_URL);
};

// mutate
/**
 *
 * @param { url, data } object
 *
 * { url: '/restApi', data: { ... } }
 * url -> prefix 로 Create, Update, Delete 구분
 * cudtype 은 자동생성
 */
export const mutate = ({ url, data = {}, timeout } = {}) => {
    _axiosMutate.defaults.timeout = timeout || 10000;

    if (!url) {
        return Promise.reject(ERROR_REST_API_URL);
    }

    if (url.includes('?')) {
        url = url + '&TOKEN=' + getAccessToken();
    } else {
        url = url + '?TOKEN=' + getAccessToken();
    }

    const DELETE = 'delete';
    const UPDATE = 'update';
    const CREATE = 'create';

    const isUpdate = url.includes(UPDATE);
    const isDelete = !isUpdate && url.includes(DELETE);

    if (isUpdate || isDelete) {
        data.cudtype = isUpdate ? UPDATE : DELETE;
        return _axiosMutate.put(url, data);
    }

    if (url.includes(CREATE)) {
        data.cudtype = CREATE;
    }
    return _axiosMutate.post(url, data);
};

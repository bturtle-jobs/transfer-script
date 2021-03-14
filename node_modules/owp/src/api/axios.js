import axios from 'axios';
import throttle from 'lodash/throttle';
import store from 'owp/store';
import { setNetworkStatus } from 'owp/store/actions';
import { showMessage } from '../common/util';

const statusMap = {
    404: '허가되지 않은 페이지 요청입니다.',
    undefined: '잘못된 네트워크 요청 입니다.',
};

const _dispatch = throttle((action) => {
    store.dispatch(action);
}, 1000);

const _handleError = (error) => {
    if (error.response) {
        const { status } = error.response;

        showMessage({
            message: statusMap[status],
            variant: 'warning',
        });
    }

    _dispatch(setNetworkStatus('DONE'));

    return Promise.reject(error);
};

const _setInterceptors = (instance) => {
    instance.interceptors.request.use((config) => {
        _dispatch(setNetworkStatus('START'));

        return config;
    }, _handleError);

    instance.interceptors.response.use((response) => {
        _dispatch(setNetworkStatus('DONE'));

        return response;
    }, _handleError);
};

export const setDefaultAxiosConfig = () => {
    axios.defaults.baseURL = process.env.REACT_APP_REST_API_URL;

    console.log('axios.defaults.baseURL', axios.defaults.baseURL);

    axios.defaults.transformResponse = [
        (response) => {
            // console.log('response', response);
            if (typeof response === 'string') {
                try {
                    const json = JSON.parse(response);
                    // console.log('json', json);
                    return json;
                } catch (error) {
                    return error;
                }
            }
            return response;
        },
    ];
    axios.defaults.onUploadProgress = (progressEvent) => {
        const value = Math.floor((progressEvent.loaded * 100) / progressEvent.total);

        _dispatch(setNetworkStatus('LOADING', value));
    };

    _setInterceptors(axios);
};

export const createAxios = (config) => {
    const instance = axios.create(config);

    instance.defaults.timeout = 10000;
    console.debug('axios.defaults.timeout', instance.defaults.timeout); // = 5000 ;

    _setInterceptors(instance);

    return instance;
};

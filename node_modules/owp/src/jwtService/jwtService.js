import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { isArray, isEmpty } from 'lodash';
import FuseUtils from 'owp/@fuse/FuseUtils';
import { mutate, query } from 'owp/api';
import { getAccessToken, removeAccessToken, setAccessToken } from 'owp/auth';
import { OwpStorage } from 'owp/common';
import {
    STORAGE_FAILED_LOGIN_KEY,
    STORAGE_PERMISSION_KEY,
    STORAGE_SESSION_KEY,
    STORAGE_USER_ID_KEY,
} from 'owp/constants';
import { OwpMessage } from 'owp/wrapper';

class jwtService extends FuseUtils.EventEmitter {
    init() {
        this.setInterceptors();
        this.handleAuthentication();
    }

    setInterceptors = () => {
        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (err) => {
                return new Promise((resolve, reject) => {
                    if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
                        // if you ever get an unauthorized response, logout the user
                        this.emit('onAutoLogout', 'Invalid access_token');
                        this.setSession(null);
                    }
                    throw err;
                });
            }
        );
    };

    handleAuthentication = () => {
        let access_token = this.getAccessToken();

        if (!access_token) {
            return;
        }

        if (this.isAuthTokenValid(access_token)) {
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        } else {
            this.setSession(null);
            this.emit('onAutoLogout', 'access_token expired');
        }
    };

    createUser = (data) => {
        return new Promise((resolve, reject) => {
            axios.post('/api/auth/register', data).then((response) => {
                if (response.data.user) {
                    this.setSession(response.data.access_token);
                    resolve(response.data.user);
                } else {
                    reject(response.data.error);
                }
            });
        });
    };

    processLogin = (id, url) =>
        new Promise(async (resolve, reject) => {
            try {
                if (!id || !url) {
                    reject(new Error('url 이 선언되지 않았습니다.'));
                    return;
                }

                const data = await query({ url });

                console.log(data);

                let loginfail = OwpStorage.getItem(STORAGE_FAILED_LOGIN_KEY) || {};

                if (process.env.REACT_APP_AUTO_LOGOUT_CHECK === 'true') {
                    //자동 로그아웃 시간 설정(분)(기본설정은 5분으로 셋팅 1분=60000 밀리세컨트)
                    let OWP_SessionExpireMinute = 600000;

                    const resultData = await query({
                        url: '/loadIpxSystemmanageOWP',
                        timeout: 1000,
                    });

                    if (!isEmpty(resultData)) {
                        console.log(resultData);

                        //자동 로그아웃 시간 설정(분) DB에서 밀리세컨트로 계산해서 로드
                        OWP_SessionExpireMinute = resultData['SESSIONEXPIREMINUTE'];

                        console.log('OWP_SessionExpireMinute1 : ', OWP_SessionExpireMinute);
                    }

                    console.log('OWP_SessionExpireMinute2 : ', OWP_SessionExpireMinute);
                    OwpStorage.setItem('OWP_SessionExpireMinute', OWP_SessionExpireMinute);
                }
                

                if (isEmpty(data)) {
                    let loginfailcnt = ~~loginfail[id];

                    loginfail[id] = loginfailcnt + 1;

                    OwpStorage.setItem(STORAGE_FAILED_LOGIN_KEY, JSON.stringify(loginfail));

                    reject(new Error('로그인에 실패 했습니다.'));
                } else {
                    //사용자가 잠금처리되었을 경우
                    if (data['errorCode'] === '-90002') {
                        OwpMessage({
                            message: data['errorMessage'], //text or html
                            variant: 'error', //success error info warning null
                        });

                        //존재하지 않는 계정일 경우
                    } else if (data['errorCode'] === '-90004') {
                        OwpMessage({
                            message: data['errorMessage'],
                            variant: 'error',
                        });
                    } else {

                        loginfail[id] = 0;
                        OwpStorage.setItem(STORAGE_FAILED_LOGIN_KEY, JSON.stringify(loginfail));
                        OwpStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(data));
                        OwpStorage.setItem(STORAGE_USER_ID_KEY, id);

                        this.setSession(data.token);

                        function getPermitData(_data = []) {
                            if (isEmpty(_data)) {
                                return {};
                            }

                            return _data.reduce(function (acc, item = {}) {
                                if (!!item.id && !!item.permission) {
                                    acc = { ...acc, [item.id]: item.permission };
                                }

                                if (!isEmpty(item.children) && isArray(item.children)) {
                                    acc = { ...acc, ...getPermitData(item.children) };
                                }

                                return acc;
                            }, {});
                        }

                        const PERMIT = getPermitData(data.navigation);

                        OwpStorage.setItem(STORAGE_PERMISSION_KEY, JSON.stringify(PERMIT));

                        resolve(data);
                    }
                }
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });

    signInWithEmailAndPassword = async (email, password) =>
        await this.processLogin(email, `/loadIpxUserForLogin/${email}/${btoa(password)}`);

    signInWithRfid = async (rfid) =>
        await this.processLogin(rfid, `/loadIpxUserForLogin_RFID/${rfid}`);

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/auth/access-token', {
                    data: {
                        access_token: this.getAccessToken(),
                    },
                })
                .then((response) => {
                    if (response.data.user) {
                        this.setSession(response.data.access_token);
                        resolve(response.data.user);
                    } else {
                        reject(response.data.error);
                    }
                });
        });
    };

    updateUserData = (user) => {
        return axios.post('/api/auth/user/update', {
            user: user,
        });
    };

    updatePw = async (user) => {
        const data = {
            cudtype: 'UPDATE',
            'IPX_User.UserSEQ': '' + user['UserSEQ'],
            'IPX_User.UserID': '' + user[STORAGE_USER_ID_KEY],
            'IPX_User.UserPassword': user['password'],
            'IPX_User.LastPasswordChangeDate': 'NOW',
            'IPX_User.InitialPasswordChangeFlag': 'Y',
        };

        try {
            const result = await mutate({
                url: '/updatePw',
                data,
            });
            return result;
        } catch (error) {
            console.error('error', error);
            return null;
        }
    };

    updateIPX_User_LockFlag = async (user) => {
        try {
            const result = await mutate({
                url: '/updateIPX_User_LockFlag/' + user + '/Y',
            });
            return result;
        } catch (error) {
            console.error('error', error);
            return null;
        }
    };

    setSession = (access_token) => {
        console.log('access_token :::::::: ', access_token);

        if (access_token) {
            setAccessToken(access_token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
        } else {
            removeAccessToken();
            OwpStorage.removeItem(STORAGE_SESSION_KEY);
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    logout = () => {
        query({ url: '/loadIpxUserForLogout' })
            .then((res) => {
                console.log('Logout');
            })
            .catch((error) => console.error('error...', error));
        this.setSession(null);
    };

    isAuthTokenValid = (access_token) => {
        if (!access_token) {
            return false;
        }
        const decoded = jwtDecode(access_token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        } else {
            return true;
        }
    };

    getAccessToken = () => {
        return getAccessToken();
    };
}

const instance = new jwtService();

export default instance;

import throttle from 'lodash/throttle';
import { query } from 'owp/api';
import { setCommonCodeData } from 'owp/auth/store/actions';
import store from 'owp/store';
import history from 'owp/history';

const _dispatch = throttle((action) => {
    console.log('OwpCommon _dispatch !!!!!!');
    store.dispatch(action);
}, 1000);

const setCommonCode = async () => {
    console.log('OwpCommon setCommonCode !!!!!!');

    _dispatch({
        type: 'RESET_APP',
    });

    _dispatch(
        setCommonCodeData(
            await query({
                url: process.env.REACT_APP_REST_API_URL + '/listIPX_CommonCodeTotalAC', //process.env.REACT_APP_REST_API_URL+
            })
        )
    );
};

setCommonCode();


const token = window.sessionStorage.getItem('jwt_access_token');
const localStoragetoken = window.localStorage.getItem('jwt_access_token');


if(process.env.REACT_APP_CLOSELOGOUT_CHECK==='true'){
    console.log("process.env.REACT_APP_CLOSELOGOUT_CHECK :  ",process.env.REACT_APP_CLOSELOGOUT_CHECK);
    if(window.location.pathname ==="/" && window.document.referrer === "" && token === null && localStoragetoken === null ){
        //크롬창 닫고, 최초 로그인 화면일 경우
        //console.log(" 최초 브라우저 켰을때 ");
        history.replace('/');
    }
    //크롬창 닫기 버튼 눌렀을 경우 자동 로그아웃 처리
    else if(window.location.pathname!=='/login' && !token){
        if(window.location.pathname!=='/login'&&!token&&!window.document.referrer){
            console.log("token ",token);
            console.log('SESSION EXPIRED');
            history.replace('/logout');
        }


    }
}
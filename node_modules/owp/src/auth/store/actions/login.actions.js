import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { setUserData } from 'owp/auth/store/actions/user.actions';
import jwtService from 'owp/jwtService';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({ rfid, email, password }) {
    return async (dispatch) => {
        try {
            const result = await (!isEmpty(rfid)
                ? jwtService.signInWithRfid(rfid)
                : jwtService.signInWithEmailAndPassword(email, password));

            if (isEmpty(get(result, 'PERMISSIONID')) && !isEmpty(get(result, 'errorCode'))) {
                return dispatch({
                    type: LOGIN_ERROR,
                    payload: result,
                });
            }

            dispatch(setUserData(result));

            return dispatch({
                type: LOGIN_SUCCESS,
            });
        } catch (error) {
            return dispatch({
                type: LOGIN_ERROR,
                payload: error,
            });
        }
    };
}

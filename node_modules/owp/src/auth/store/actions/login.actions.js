import isEmpty from 'lodash/isEmpty';
import { setUserData } from 'owp/auth/store/actions/user.actions';
import jwtService from 'owp/jwtService';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export function submitLogin({ rfid, email, password }) {
    return async (dispatch) => {
        try {
            const userData = await (!isEmpty(rfid)
                ? jwtService.signInWithRfid(rfid)
                : jwtService.signInWithEmailAndPassword(email, password));

            dispatch(setUserData(userData));

            const result = dispatch({
                type: LOGIN_SUCCESS,
            });

            return result;
        } catch (error) {
            return dispatch({
                type: LOGIN_ERROR,
                payload: error,
            });
        }
    };
}

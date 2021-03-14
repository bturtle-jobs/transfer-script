import * as UserActions from 'owp/auth/store/actions';
import jwtService from 'owp/jwtService';

export const REGISTER_ERROR = 'REGISTER_ERROR';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

export function submitRegister({ displayName, password, email }) {
  return dispatch =>
    jwtService
      .createUser({
        displayName,
        password,
        email,
      })
      .then(user => {
        dispatch(UserActions.setUserData(user));
        return dispatch({
          type: REGISTER_SUCCESS,
        });
      })
      .catch(error => {
        return dispatch({
          type: REGISTER_ERROR,
          payload: error,
        });
      });
}

import _ from 'lodash';
import { OwpStorage } from 'owp/common';
import history from 'owp/history';
import jwtService from 'owp/jwtService';
import store from 'owp/store';
import * as Actions from 'owp/store/actions';
import { path, pipe } from 'ramda';

export const SET_USER_DATA = '[USER] SET DATA';
export const SET_USER_SHORTCUTS = '[USER] SET SHORTCUTS';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

function mapNav(user) {
    return pipe(
        path(['navigation'])
        // map(merge({ type: 'item' }))
    )(user);
}

/**
 * Set User Data
 */
export function setUserData(user) {
    return (dispatch) => {
        /*
        Set User Settings
         */
        // dispatch(setDefaultSettings(user.data.settings));

        /*
        Set User Data
         */
        dispatch({
            type: SET_USER_DATA,
            payload: user,
        });

        // TODO: don't need action for nav
        if (process.env.REACT_APP_LOGIN_CHECK === 'true' && user.navigation) {
            dispatch(Actions.setNavigation(mapNav(user)));
        }
    };
}

export function setUserShortcuts(shortcuts) {
    return {
        type: SET_USER_SHORTCUTS,
        shortcuts,
    };
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
    return (dispatch, getState) => {
        const oldUser = getState().auth.user;
        const user = _.merge({}, oldUser, { data: { settings } });

        updateUserData(user);

        return dispatch(setUserData(user));
    };
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
    return (dispatch) => {
        // updateUserData({shortcuts});

        return dispatch(setUserShortcuts(shortcuts));
    };
}

/**
 * Remove User Data
 */
export function removeUserData() {
    return {
        type: REMOVE_USER_DATA,
    };
}

/**
 * Logout
 */
export function logoutUser() {
    return (dispatch, getState) => {
        const user = getState().auth.user;

        OwpStorage.clear();

        if (user.role === 'guest') {
            return null;
        }

        history.push({
            pathname: '/login',
        });

        switch (user.from) {
            default: {
                dispatch({
                    type: 'RESET_APP',
                });
                jwtService.logout();
            }
        }

        dispatch({
            type: USER_LOGGED_OUT,
        });
    };
}

/**
 * Update User Data
 */
function updateUserData(user) {
    if (user.role === 'guest') {
        return;
    }

    switch (user.from) {
        default: {
            jwtService
                .updateUserData(user)
                .then(() => {
                    store.dispatch(
                        Actions.showMessage({
                            message: 'User data saved with api',
                        })
                    );
                })
                .catch((error) => {
                    store.dispatch(Actions.showMessage({ message: error.message }));
                });
            break;
        }
    }
}

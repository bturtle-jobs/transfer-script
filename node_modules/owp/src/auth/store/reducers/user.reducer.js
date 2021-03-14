import { get, isEmpty } from 'lodash';
import * as Actions from '../actions';

function mapProfile(data = {}) {
    return {
        id: get(data, 'profile.id'),
        email: '',
        userId: get(data, 'USERID'),
        userSeq: get(data, 'USERSEQ'),
        displayName: get(data, 'USERNAME'),
        deptName: get(data, 'DEPTID_CODENM'),
        permissionName: get(data, 'PERMISSIONID_CODENM'),
        rankName: get(data, 'RANKID_CODENM'),
        navigation: get(data, 'navigation'),
    };
}

function mapUserData({ role = 'guest', shortcuts = [], ...rest } = {}) {
    return {
        role,
        shortcuts,
        data: mapProfile(rest),
    };
}

const initialState = mapUserData();

const user = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_USER_DATA: {
            return mapUserData({
                role: isEmpty(action.payload) ? 'guest' : 'staff',
                ...action.payload,
            });
        }
        case Actions.SET_USER_SHORTCUTS: {
            return {
                ...state,
                shortcuts: action.shortcuts,
            };
        }
        case Actions.REMOVE_USER_DATA: {
            return {
                ...initialState,
            };
        }
        case Actions.USER_LOGGED_OUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default user;

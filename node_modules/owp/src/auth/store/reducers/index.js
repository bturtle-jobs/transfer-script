import { combineReducers } from 'redux';
import common from './common.reducer';
import login from './login.reducer';
import register from './register.reducer';
import user from './user.reducer';

const authReducers = combineReducers({
    user,
    login,
    register,
    common,
});

export default authReducers;

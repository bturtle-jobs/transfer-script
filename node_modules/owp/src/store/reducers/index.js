import auth from 'owp/auth/store/reducers';
import { combineReducers } from 'redux';
import fuse from './fuse';
import owp from './owp';
import persistor from './persistor';

const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        fuse,
        owp,
        persistor,
        ...asyncReducers,
    });

export default createReducer;

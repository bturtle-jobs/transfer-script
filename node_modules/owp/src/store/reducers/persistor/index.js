import { combineReducers } from 'redux';
import search from './search.reducer';

const fuseReducers = combineReducers({
    search,
});

export default fuseReducers;

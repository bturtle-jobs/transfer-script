import { combineReducers } from 'redux';
import config from './config.reducer';
import network from './network.reducer';
import page from './page.reducer';
import wrapper from './wrapper.reducer';

const owpReducers = combineReducers({
    page,
    network,
    wrapper,
    config,
});

export default owpReducers;

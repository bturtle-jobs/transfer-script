import createReducer from 'owp/store/reducers';
import * as reduxModule from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

/*
Fix for Firefox redux dev tools extension
https://github.com/zalmoxisus/redux-devtools-instrument/pull/19#issuecomment-400637274
 */
reduxModule.__DO_NOT_USE__ActionTypes.REPLACE = '@@redux/INIT';

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
          })
        : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['persistor', 'auth'],
};

const createRootReducer = (...params) => (state, action) => {
    if (action.type === 'RESET_APP') {
        state = { fuse: state.fuse, owp: state.owp };
        purgeStoredState(persistConfig);
    }

    return createReducer(...params)(state, action);
};

const persistedReducer = persistReducer(persistConfig, createRootReducer());
const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);

store.asyncReducers = {};

export const injectReducer = (key, reducer) => {
    if (store.asyncReducers[key]) {
        return;
    }
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createRootReducer(store.asyncReducers));
    return store;
};

export default store;

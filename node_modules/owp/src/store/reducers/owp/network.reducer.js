import * as Actions from 'owp/store/actions';

const initialState = {
    status: null,
    value: 0,
};

const network = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_NETWORK_STATUS:
            return {
                ...state,
                status: action.status,
                value: action.value || 0,
            };

        default:
            return state;
    }
};

export default network;

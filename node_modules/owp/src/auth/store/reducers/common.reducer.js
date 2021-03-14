import * as Actions from '../actions';

const common = function(state = {}, action) {
    switch (action.type) {
        case Actions.SET_COMMON_CODE: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

export default common;

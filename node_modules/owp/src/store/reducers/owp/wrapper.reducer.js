import * as Actions from '../../actions/owp';

const initialState = {
    isReset: false
};

const wrapper = function(state = initialState, action) {
    switch (action.type) {
        case Actions.RESET_AUTOCOMPLATE:
            return {
                ...state,
                isReset: action.isReset
            };

        default:
            return state;
    }
};

export default wrapper;

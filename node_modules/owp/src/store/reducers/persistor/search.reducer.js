import * as Actions from '../../actions/persistor';

const initialState = {
    searchHistories: [],
};

const search = function(state = initialState, action) {
    switch (action.type) {
        case Actions.ADD_SEARCH_HISTORY:
            if (state.searchHistories.length < 6) {
                state.searchHistories.unshift(action.searchHistory);

                return {
                    ...state,
                };
            }

            return state;
        default:
            return state;
    }
};

export default search;

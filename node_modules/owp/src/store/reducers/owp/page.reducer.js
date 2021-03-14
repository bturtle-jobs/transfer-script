import * as Actions from '../../actions/owp';

const initialState = {
    pageTitle: '',
    breadcrumb: [],
};

const page = function(state = initialState, action) {
    switch (action.type) {
        case Actions.SET_PAGE_TITLE:
            return {
                ...state,
                pageTitle: action.pageTitle,
            };

        case Actions.SET_PAGE_BREADCRUMB:
            return {
                ...state,
                breadcrumb: action.breadcrumb,
            };

        default:
            return state;
    }
};

export default page;

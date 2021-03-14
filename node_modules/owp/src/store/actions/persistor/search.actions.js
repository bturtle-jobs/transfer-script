export const ADD_SEARCH_HISTORY = '[SEARCH] ADD SEARCH HISTORY';

export function addSearchHistory(searchHistory) {
    return {
        type: ADD_SEARCH_HISTORY,
        searchHistory,
    };
}

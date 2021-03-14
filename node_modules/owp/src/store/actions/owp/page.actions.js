export const SET_PAGE_TITLE = '[PAGE] SET TITLE';
export const SET_PAGE_BREADCRUMB = '[PAGE] SET BREADCRUMB';

export function setPageTitle(pageTitle) {
    return {
        type: SET_PAGE_TITLE,
        pageTitle,
    };
}

export function setPageBreadcrumb(breadcrumb) {
    return {
        type: SET_PAGE_BREADCRUMB,
        breadcrumb,
    };
}

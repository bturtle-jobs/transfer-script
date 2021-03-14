import * as Actions from 'owp/store/actions';

const initialState = {
    loginLogoUrl: '/assets/images/logos/logo.svg',
    navbarLogoUrl: '/assets/images/logos/logo.svg',
    navbarLogoThumbUrl: '/assets/images/logos/owp_symbol.png',
    navbarWidth: 280,
};

const config = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_LOGIN_LOGO_URL:
            return {
                ...state,
                loginLogoUrl: action.loginLogoUrl,
            };

        case Actions.SET_NAVBAR_LOGO_URL:
            return {
                ...state,
                navbarLogoUrl: action.navbarLogoUrl,
            };

        case Actions.SET_NAVBAR_LOGO_THUMB_URL:
            return {
                ...state,
                navbarLogoThumbUrl: action.navbarLogoThumbUrl,
            };

        case Actions.SET_NAVBAR_WIDTH:
            return {
                ...state,
                navbarWidth: action.navbarWidth,
            };

        default:
            return state;
    }
};

export default config;

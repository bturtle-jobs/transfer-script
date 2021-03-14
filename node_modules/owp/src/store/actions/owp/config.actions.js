export const SET_LOGIN_LOGO_URL = '[CONFIG] SET LOGIN LOGO URL';
export const SET_NAVBAR_LOGO_URL = '[CONFIG] SET NAVBAR LOGO URL';
export const SET_NAVBAR_LOGO_THUMB_URL = '[CONFIG] SET NAVBAR LOGO THUMB URL';
export const SET_NAVBAR_WIDTH = '[CONFIG] SET NAVBAR WIDTH';

export function setLoginLogoUrl(loginLogoUrl) {
    return {
        type: SET_LOGIN_LOGO_URL,
        loginLogoUrl,
    };
}

export function setNavbarLogoUrl(navbarLogoUrl) {
    return {
        type: SET_NAVBAR_LOGO_URL,
        navbarLogoUrl,
    };
}

export function setNavbarLogoThumbUrl(navbarLogoThumbUrl) {
    return {
        type: SET_NAVBAR_LOGO_THUMB_URL,
        navbarLogoThumbUrl,
    };
}

export function setNavbarWidth(navbarWidth) {
    return {
        type: SET_NAVBAR_WIDTH,
        navbarWidth,
    };
}

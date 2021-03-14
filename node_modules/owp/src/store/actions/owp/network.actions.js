export const SET_NETWORK_STATUS = '[NETWORK] SET STATUS';

export function setNetworkStatus(status, value) {
    return {
        type: SET_NETWORK_STATUS,
        status,
        value,
    };
}

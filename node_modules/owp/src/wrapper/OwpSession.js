import { OwpStorage } from 'owp/common';

const OwpSession = function (key) {
    const session = OwpStorage.getItem('session');

    if (session) {
        return '' + session[key];
    } else {
        return null;
    }
};

export default OwpSession;

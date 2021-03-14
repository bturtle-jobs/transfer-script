import { OwpStorage } from 'owp/common';
import { STORAGE_AUTO_LOGOUT_TIME_KEY } from 'owp/constants';
import { useIdle } from 'owp/hooks';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const DEFAULT_TIMEOUT = OwpStorage.getItem(STORAGE_AUTO_LOGOUT_TIME_KEY);

function AutoLogout({ isLoggedIn, history, timeout = DEFAULT_TIMEOUT }) {
    useIdle(timeout, isLoggedIn && DEFAULT_TIMEOUT > 0, () => {
        history.replace('/logout');
    });

    return null;
}

function mapStateToProps({ auth }) {
    return {
        isLoggedIn: auth.login.success,
    };
}

export default withRouter(connect(mapStateToProps)(AutoLogout));

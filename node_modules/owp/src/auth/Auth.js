import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import { getAccessToken } from 'owp/auth';
import * as userActions from 'owp/auth/store/actions';
import history from 'owp/history';
import jwtService from 'owp/jwtService';
import * as Actions from 'owp/store/actions';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Auth extends Component {
    /*eslint-disable-next-line no-useless-constructor*/
    constructor(props) {
        super(props);

        /**
         * Comment the line if you do not use JWt
         */
        //this.jwtCheck();
    }

    componentDidMount() {
        if (process.env.REACT_APP_LOGIN_CHECK === 'true') {
            if (isEmpty(getAccessToken())) {
                history.replace('/login');
                return;
            }

            if (
                get(this.props.user, 'role') !== 'guest' &&
                isArray(get(this.props.user, 'data.navigation'))
            ) {
                this.props.setNavigation(get(this.props.user, 'data.navigation'));
            }
        }
    }

    jwtCheck = () => {
        jwtService.on('onAutoLogin', () => {
            this.props.showMessage({ message: 'Logging in with JWT' });

            /**
             * Sign in and retrieve user data from Api
             */
            jwtService
                .signInWithToken()
                .then((user) => {
                    this.props.setUserData(user);

                    this.props.showMessage({ message: 'Logged in with JWT' });
                })
                .catch((error) => {
                    this.props.showMessage({ message: error });
                });
        });

        jwtService.on('onAutoLogout', (message) => {
            if (message) {
                this.props.showMessage({ message });
            }
            this.props.logout();
        });

        jwtService.init();
    };

    render() {
        const { children } = this.props;

        return <React.Fragment>{children}</React.Fragment>;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            logout: userActions.logoutUser,
            setUserData: userActions.setUserData,
            showMessage: Actions.showMessage,
            hideMessage: Actions.hideMessage,
            setNavigation: Actions.setNavigation,
        },
        dispatch
    );
}

export default connect(({ auth }) => {
    return { user: auth.user };
}, mapDispatchToProps)(Auth);

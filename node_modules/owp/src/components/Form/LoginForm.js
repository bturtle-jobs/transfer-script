import { Button, Icon, InputAdornment, withStyles } from '@material-ui/core';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from 'owp/@fuse';
import * as Actions from 'owp/auth/store/actions';
import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

const styles = (theme) => ({
    root: {
        width: '100%',
    },
});

class LoginForm extends Component {
    state = {
        canSubmit: false,
    };

    form = React.createRef();

    disableButton = () => {
        this.setState({ canSubmit: false });
    };

    enableButton = () => {
        this.setState({ canSubmit: true });
    };

    onSubmit = (model) => {
        this.props.submitLogin(model);
    };

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.login.error &&
            (this.props.login.error.email || this.props.login.error.password)
        ) {
            this.form.updateInputsWithError({
                ...this.props.login.error,
            });

            this.props.login.error = null;
            this.disableButton();
        }

        if (this.props.user.role !== 'guest') {
            const pathname = this.props.location.state && this.props.location.state.redirectUrl;
            // ? this.props.location.state.redirectUrl
            // : '/';

            if (pathname) {
                this.props.history.push({
                    pathname,
                });
            }
        }
        return null;
    }

    render() {
        const { classes } = this.props;
        const { canSubmit } = this.state;

        return (
            <div className={classes.root}>
                <Formsy
                    onValidSubmit={this.onSubmit}
                    onValid={this.enableButton}
                    onInvalid={this.disableButton}
                    ref={(form) => (this.form = form)}
                    className="flex flex-col justify-center w-full"
                >
                    <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="email"
                        label="아이디"
                        value="Admin"
                        // validations={{
                        //     minLength: 4,
                        // }}
                        // validationErrors={{
                        //     minLength: 'Min character length is 4',
                        // }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Icon className="text-20" color="action">
                                        email
                                    </Icon>
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        required
                    />

                    <TextFieldFormsy
                        className="mb-16"
                        type="password"
                        name="password"
                        label="패스워드"
                        value="pisnet09753"
                        validations={{
                            minLength: 8,
                        }}
                        validationErrors={{
                            minLength: '비밀번호는 최소 8자 이상이어야 합니다.',
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Icon className="text-20" color="action">
                                        vpn_key
                                    </Icon>
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className="w-full mx-auto mt-16 normal-case"
                        aria-label="LOG IN"
                        disabled={!canSubmit}
                        value="legacy"
                    >
                        로그인
                    </Button>
                </Formsy>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            submitLogin: Actions.submitLogin,
        },
        dispatch
    );
}

function mapStateToProps({ auth }) {
    return {
        login: auth.login,
        user: auth.user,
    };
}

export default withStyles(styles, { withTheme: true })(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm))
);

import Button from '@material-ui/core/Button';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import { withQuery } from 'owp/api/hocs';
import * as AuthActions from 'owp/auth/store/actions';
import * as StoreActions from 'owp/store/actions';
import PropTypes from 'prop-types';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';

const OwpPresetCodeButton = ({ isSetCommonCodes, setCommonCodeData, showMessage }) => {
    return (
        <Button
            onClick={() =>
                showMessage({
                    message: isSetCommonCodes
                        ? '공통코드를 저장했습니다.'
                        : '공통코드 저장을 실패했습니다.',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                    variant: isSetCommonCodes ? 'success' : 'error',
                })
            }
        >
            공통코드
        </Button>
    );
};

OwpPresetCodeButton.propTypes = {
    isSetCommonCodes: PropTypes.bool.isRequired,
    setCommonCodeData: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
};

OwpPresetCodeButton.defaultProps = {
    isSetCommonCodes: false,
    setCommonCodeData: noop,
    showMessage: noop,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            setCommonCodeData: AuthActions.setCommonCodeData,
            showMessage: StoreActions.showMessage,
        },
        dispatch
    );
}

export default withQuery((data) => ({ isSetCommonCodes: !isEmpty(data) }))(
    connect(null, mapDispatchToProps)(OwpPresetCodeButton)
);

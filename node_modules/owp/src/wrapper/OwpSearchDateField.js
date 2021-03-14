import classNames from 'classnames';
import { withFormsy } from 'formsy-react';
import { TextFieldFormsy } from 'owp/@fuse';
import React from 'react';

const OwpSearchDateField = ({ className, ...restProps }) => {
    return (
        <TextFieldFormsy
            {...restProps}
            className={classNames('mr-20', className)}
            type="date"
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
};

OwpSearchDateField.defaultProps = {
    className: '',
};

export default withFormsy(OwpSearchDateField);

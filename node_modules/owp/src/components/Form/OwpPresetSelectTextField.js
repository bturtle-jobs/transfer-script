import { withQuery } from 'owp/api/hocs';
import React, { useState } from 'react';
import SelectTextField from './SelectTextField';
import { mapDataToOwpPresetFormProps } from './util';

const OwpPresetSelectTextField = ({ onChange, ...restProps }) => {
    const [selectedValues, setSelectedValue] = useState('');

    return (
        <SelectTextField
            value={selectedValues}
            onChange={(changedValues, evt) =>
                setSelectedValue(() => {
                    onChange(changedValues, evt);
                    return changedValues;
                })
            }
            {...restProps}
        />
    );
};

export default withQuery(mapDataToOwpPresetFormProps())(OwpPresetSelectTextField);

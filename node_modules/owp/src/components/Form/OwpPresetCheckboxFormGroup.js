import { withQuery } from 'owp/api/hocs';
import React, { useState } from 'react';
import CheckboxFormGroup from './CheckboxFormGroup';
import { mapDataToOwpPresetFormProps } from './util';

const OwpPresetCheckboxFormGroup = ({ onChange, ...restProps }) => {
    const [checkedValues, setCheckedValue] = useState([]);

    return (
        <CheckboxFormGroup
            value={checkedValues}
            onChange={(changedValues, evt) =>
                setCheckedValue(() => {
                    onChange(changedValues, evt);
                    return changedValues;
                })
            }
            {...restProps}
        />
    );
};

export default withQuery(mapDataToOwpPresetFormProps())(OwpPresetCheckboxFormGroup);

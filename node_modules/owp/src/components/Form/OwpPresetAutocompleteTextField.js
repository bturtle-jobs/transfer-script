import { withQuery } from 'owp/api/hocs';
import AutocompleteTextField from './AutocompleteTextField';
import { mapDataToOwpPresetFormProps } from './util';

export default withQuery(
    mapDataToOwpPresetFormProps({
        dataKey: 'suggestions',
    }),
    { shouldGetLoadingProp: true, useInputChange: true, dataKey: 'suggestions' }
)(AutocompleteTextField);

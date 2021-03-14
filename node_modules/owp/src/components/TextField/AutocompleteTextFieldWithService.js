import { withQuery } from 'owp/common/hocs';
import AutocompleteTextField from './AutocompleteTextField';

function mapDataToProps(data) {
    return {
        suggestions: data.map((suggestion) => ({
            label: suggestion['IPX_COMMONCODE.CODENM'],
            value: suggestion['IPX_COMMONCODE.CODEID'],
        })),
    };
}

export default withQuery(mapDataToProps)(AutocompleteTextField);

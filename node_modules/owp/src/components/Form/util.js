export function mapDataToOwpPresetFormProps(options = {}) {
    return (data, { query = {} } = {}) => {
        const dataKey = query.dataKey || options.dataKey || 'items';
        const labelKey = query.labelKey || options.labelKey || 'label';
        const valueKey = query.valueKey || options.valueKey || 'value';

        const hasItemKeysOfOptions = typeof options.item === 'object';
        const hasItemKeysOfQuery = typeof query.item === 'object';

        return {
            [dataKey]: data.map((item = {}) => ({
                [labelKey]:
                    (hasItemKeysOfOptions && item[options.item.labelKey]) ||
                    (hasItemKeysOfQuery && item[query.item.labelKey]) ||
                    item.CODENM ||
                    item['IPX_COMMONCODE.CODENM'],
                [valueKey]:
                    (hasItemKeysOfOptions && item[options.item.valueKey]) ||
                    (hasItemKeysOfQuery && item[query.item.valueKey]) ||
                    item.CODEID ||
                    item['IPX_COMMONCODE.CODEID'],
            })),
        };
    };
}

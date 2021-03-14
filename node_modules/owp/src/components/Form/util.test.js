import { mapDataToOwpPresetFormProps } from './util';

describe('mapDataToOwpPresetFormProps', () => {
    const mockData = [
        {
            'IPX_CommonCode.GROUPNM': '판넬_규격',
            'IPX_CommonCode.GROUPID': 'D004000',
            'IPX_CommonCode.FLAG': 'Y',
            'IPX_CommonCode.CODEID': 'D004001',
            'IPX_CommonCode.DESCRIPTION': '',
            'IPX_CommonCode.CODENM': '0.45T',
        },
        {
            'IPX_CommonCode.GROUPNM': '판넬_규격',
            'IPX_CommonCode.GROUPID': 'D004000',
            'IPX_CommonCode.FLAG': 'Y',
            'IPX_CommonCode.CODEID': 'D004002',
            'IPX_CommonCode.DESCRIPTION': '',
            'IPX_CommonCode.CODENM': '0.4T',
        },
    ];

    test('if any options or props are not provided, it should return default array of object', () => {
        const items = mapDataToOwpPresetFormProps()(mockData);
        expect(items).toMatchSnapshot();
    });

    test('if options is provided, it should return valid array of object based on `options`', () => {
        const options = {
            dataKey: 'suggestions',
            item: {
                labelKey: 'IPX_CommonCode.GROUPNM',
                valueKey: 'IPX_CommonCode.GROUPID',
            },
        };
        const items = mapDataToOwpPresetFormProps(options)(mockData);
        expect(items).toMatchSnapshot();
    });

    test('if options and props are provided, it should return valid array of object based on `props`', () => {
        const options = {
            dataKey: 'suggestions',
            item: {
                labelKey: 'IPX_CommonCode.GROUPNM',
                valueKey: 'IPX_CommonCode.GROUPID',
            },
        };
        const props = {
            query: {
                dataKey: 'items',
                item: {
                    labelKey: 'IPX_CommonCode.CODENM',
                    valueKey: 'IPX_CommonCode.CODEID',
                },
            },
        };
        const items = mapDataToOwpPresetFormProps(options)(mockData, props);
        expect(items).toMatchSnapshot();
    });

    test('if options and props are provided, it should return valid array of object based on `props` (with root label, value key)', () => {
        const options = {
            dataKey: 'suggestions',
            labelKey: 'Text',
            valueKey: 'Name',
            item: {
                labelKey: 'IPX_CommonCode.GROUPNM',
                valueKey: 'IPX_CommonCode.GROUPID',
            },
        };
        const props = {
            query: {
                dataKey: 'items',
                labelKey: 'Text',
                valueKey: 'Name',
                item: {
                    labelKey: 'IPX_CommonCode.CODENM',
                    valueKey: 'IPX_CommonCode.CODEID',
                },
            },
        };
        const items = mapDataToOwpPresetFormProps(options)(mockData, props);
        expect(items).toMatchSnapshot();
    });
});

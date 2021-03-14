import { makeBatchData, transform, transformToEnum } from './util';

describe('`transform` function,', () => {
    test('given array of object, it should returns valid treegrid object', () => {
        const mockColumns = {
            a: 'a',
            b: 'b',
            'b.c': 'b.c',
        };

        const mockData = [
            {
                a: 'a',
                'a.b': 'a.b',
                'a.b.c': 'a.b.c',
            },
        ];

        const actualData = transform(mockColumns, mockData);

        expect(actualData).toMatchSnapshot();
    });

    test('geturns object when data vlaue is object', () => {
        const mockColumns = {
            d: 'd',
        };

        const mockData = [
            {
                d: {
                    d: '|/assets/images/treegrid/Yellow.svg',
                    dType: 'Img',
                    dHtmlPostFix: 'd',
                },
            },
        ];

        const actualData = transform(mockColumns, mockData);

        expect(actualData).toMatchSnapshot();
    });

    test('if `cellOptions` is given, it should return valid data', () => {
        const mockColumns = {
            d: 'd',
        };

        const data = [
            {
                d: 'ddd',
            },
        ];

        const actualData = transform(mockColumns, data, {
            cellOptions: { d: { Type: 'Date' } },
        });
        expect(actualData).toMatchSnapshot();
    });
});

describe('`transformToEnum` function,', () => {
    test('should return valid treegrid enum format object', () => {
        const data = [
            {
                'IPX_CommonCode.DESCRIPTION': '',
                'IPX_CommonCode.CODEID': 'D044001',
                'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
                'IPX_CommonCode.GROUPID': 'D044000',
                'IPX_CommonCode.CODENM': '시스템관리자',
                'IPX_CommonCode.FLAG': 'Y',
            },
            {
                'IPX_CommonCode.DESCRIPTION': '',
                'IPX_CommonCode.CODEID': 'D044003',
                'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
                'IPX_CommonCode.GROUPID': 'D044000',
                'IPX_CommonCode.CODENM': '운영관리자',
                'IPX_CommonCode.FLAG': 'Y',
            },
            {
                'IPX_CommonCode.DESCRIPTION': '',
                'IPX_CommonCode.CODEID': 'D044004',
                'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
                'IPX_CommonCode.GROUPID': 'D044000',
                'IPX_CommonCode.CODENM': '일반사용자',
                'IPX_CommonCode.FLAG': 'Y',
            },
        ];

        const enums = transformToEnum(
            ['IPX_CommonCode.CODENM', 'IPX_CommonCode.CODEID'],
            data
        );

        expect(enums).toMatchSnapshot();
    });
});

test('should return valid array of object for rest api', () => {
    expect(
        makeBatchData([
            { id: 1, Deleted: '1' },
            { id: 2, a: '1' },
            { id: 3, Changed: '1', CODE: 'D044003' },
            { id: 4, Added: '1', CODE: 'D044001' },
        ])
    ).toMatchSnapshot();
});

import { getPath } from './navigation';

const mockNavsData = [
    {
        title: 'a',
        url: '/a',
        children: [
            {
                title: 'b',
                url: '/b',
                children: [
                    {
                        title: 'c',
                        url: '/c',
                    },
                ],
            },
        ],
    },
];

describe('`getPath`', () => {
    describe('given valid navigation and location object', () => {
        test('it should return array of navigation object from root to matched location navigation object', () => {
            expect(getPath(mockNavsData, { pathname: '/c' })).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ title: 'c' }),
                    expect.objectContaining({ title: 'b' }),
                    expect.objectContaining({ title: 'a' }),
                ])
            );
        });
    });
});

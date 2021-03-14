// TODO: convert it to ramda style function
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import {
    assoc,
    complement,
    cond,
    curry,
    filter,
    has,
    isNil,
    keys,
    map,
    merge,
    mergeAll,
    omit,
    path,
    pathEq,
    pipe,
    prop,
    props,
    reduce,
    toPairs,
} from 'ramda';

const isNotNil = complement(isNil);
const renameKeys = curry((keysMap, obj) =>
    reduce(
        (acc, key) => assoc(keysMap[key] || key, obj[key], acc),
        {},
        keys(obj)
    )
);
const makeJsonFromXmlNodes = nodes => {
    try {
        const newItem = {};
        for (const attr of nodes.attributes) {
            newItem[attr.name] = attr.value;
        }

        return newItem;
    } catch (error) {
        return undefined;
    }
};

export const transform = (
    obj = {},
    data = [],
    {
        columnOptions = {},
        cellOptions = {},
        headOptions = [],
        selectColumns = {},
        radioColumns = {},
        suggestColumns = {},
        layoutColumns,
        selectCells,
        radioCells,
    } = {}
) => {
    const header = { ...obj };

    const cols = map(
        column =>
            mergeAll([
                column,
                prop(column.Name, columnOptions),
                prop(column.Name, suggestColumns),
                makeEnumCell(selectColumns[column.Name], 'Enum'),
                makeEnumCell(radioColumns[column.Name], 'Radio'),
            ]),
        Array.isArray(layoutColumns)
            ? layoutColumns
            : pipe(
                  keys,
                  map(key => ({ Name: key, RelWidth: 1 }))
              )(obj)
    );

    const bodyItem = reduce((newItem, [key, value]) => {
        // const newKey = ifElse(
        //     arr => gt(length(arr), 1),
        //     arr => join('.')(tail(arr)),
        //     head
        // )(key.split('.'));
        const newKey = key;

        if (isPlainObject(value)) {
            newItem = value;
        } else {
            newItem[newKey] = value;
        }

        if (cellOptions[newKey]) {
            newItem = mapToValidKeys(newKey, newItem, cellOptions[newKey]);
        }

        if (selectCells && selectCells[newKey]) {
            const selectEnumCell = makeEnumCell(selectCells[newKey], 'Enum');
            newItem = mapToValidKeys(newKey, newItem, selectEnumCell);
        }

        if (radioCells && radioCells[newKey]) {
            const radioEnumCell = makeEnumCell(radioCells[newKey], 'Radio');
            newItem = mapToValidKeys(newKey, newItem, radioEnumCell);
        }

        return newItem;
    });

    const body = map(item => bodyItem({}, toPairs(item)), data);

    return {
        Cols: cols,
        Header: header,
        Head: headOptions,
        Body: [body],
    };
};

const makeEnumCell = (cell, enumType = 'Enum') => {
    if (!cell) return;

    const enumCell = transformToEnum([cell.labelKey, cell.valueKey], cell.data);
    enumCell.Type = enumType;

    return enumCell;
};

const mapToValidKeys = (baseKey, base, item) =>
    merge(
        base,
        mapKeys(item, (value, key) => {
            return `${baseKey}${key}`;
        })
    );

export const transformToEnum = (keys, data) => {
    const pairs = map(props(keys), data);
    const toValidEnumFormat = (o, cur) => {
        o.Enum = `${o.Enum}|${cur[0]}`;
        o.EnumKeys = `${o.EnumKeys}|${cur[1]}`;
        return o;
    };

    return reduce(toValidEnumFormat, { Enum: '', EnumKeys: '' }, pairs);
};

export const parseXML = xmlString => {
    if (typeof DOMParser !== 'function') {
        return;
    }

    return new DOMParser().parseFromString(xmlString, 'text/xml');
};

export const changesAsJSON = pipe(
    parseXML,
    path(['firstChild', 'childNodes']),
    map(makeJsonFromXmlNodes)
);

export const getSelectedData = pipe(
    (data, { rowIdKey } = {}) =>
        map(
            cond([
                [
                    has('Selected'),
                    pipe(
                        omit(['Selected']),
                        renameKeys({ id: rowIdKey })
                    ),
                ],
            ]),
            data
        ),
    filter(isNotNil)
);

export const makeBatchData = pipe(
    (data, { rowIdKey, userSeq } = {}) =>
        map(
            cond([
                [
                    has('Deleted'),
                    pipe(
                        omit(['Deleted']),
                        renameKeys({ id: rowIdKey }),
                        merge({ STATUS: 'Delete' })
                    ),
                ],
                [
                    has('Changed'),
                    pipe(
                        omit(['Changed']),
                        renameKeys({ id: rowIdKey }),
                        merge({ STATUS: 'Update' })
                    ),
                ],
                [
                    has('Added'),
                    pipe(
                        omit([
                            'Added',
                            'id',
                            'Def',
                            'Next',
                            'Parent',
                            'Prev',
                            // pkName, // TODO: https://github.com/leeinbae/owp/issues/42#issuecomment-463965528
                        ]),
                        merge({
                            STATUS: 'Create',
                            [rowIdKey
                                ? `${rowIdKey.split('.')[0]}.WUSERSEQ`
                                : 'WUSERSEQ']: userSeq,
                        })
                    ),
                ],
            ]),
            data
        ),
    filter(isNotNil)
);

export const makeColumnsFromGridLayout = pipe(
    parseXML,
    path(['firstChild', 'childNodes']),
    filter(pathEq(['nodeName'], 'Cols')),
    path(['0', 'childNodes']),
    map(makeJsonFromXmlNodes),
    filter(isNotNil)
);

export const fetchAsText = (url, options = {}) =>
    new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => resolve(response.text()))
            .catch(error => reject(error));
    });

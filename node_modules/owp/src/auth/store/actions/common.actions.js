import { is, keys, path, pipe } from 'ramda';

function mapDataToItems(data = []) {
    return data.map((item = {}) => ({
        label: item.CODENM || item['IPX_COMMONCODE.CODENM'],
        value: item.CODEID || item['IPX_COMMONCODE.CODEID'],
    }));
}

function mapCommonCode(codes) {
    const commonCodes = { codes: {} };
    for (const code of codes) {
        const key = pipe(
            keys,
            _keys => is(Array, _keys) && is(String, _keys[0]) && _keys[0]
        )(code);

        if (!!key) {
            commonCodes.codes[key] = pipe(
                path([key, 'CODES']),
                mapDataToItems
            )(code);
        }
    }

    return commonCodes;
}

export const SET_COMMON_CODE = '[COMMON] COMMON CODE';

/**
 * Set User Data
 */
export function setCommonCodeData(codes) {
    return dispatch => {
        /*
        Set Common Code Data
         */
        dispatch({
            type: SET_COMMON_CODE,
            payload: mapCommonCode(codes),
        });
    };
}

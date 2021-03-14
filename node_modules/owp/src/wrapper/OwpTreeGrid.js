import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const TREE_GRID_TEXT_CONFIG_URL = '/assets/vendors/Grid/Text.xml';

function OwpTreeGrid({ id, className, style, height, width, LayoutUrl, DataUrl, data, onMount }) {
    const gridInstanceRef = useRef(null);

    useEffect(() => {
        const gridInstance = window.TreeGrid(
            {
                id,
                Layout: { Url: LayoutUrl },
                Data: isEmpty(data)
                    ? {
                          Url: DataUrl.includes('assets')
                              ? DataUrl
                              : `${process.env.REACT_APP_REST_API_URL}/${DataUrl}`,
                      }
                    : { Data: { Body: [data] } },
                Text: { Url: TREE_GRID_TEXT_CONFIG_URL },
                width,
                height,
                Debug: 'Error',
            },
            id,
            id
        );

        gridInstance.TmpFocus = 0;
        gridInstanceRef.current = gridInstance;
        onMount(gridInstance);

        return () => {
            if (!!gridInstance) {
                gridInstance.Dispose();
            }
        };
    }, []);

    useEffect(() => {
        const bodyData = get(gridInstanceRef.current, 'Data.Data.Data.Body');

        if (!isEmpty(bodyData) && !isEqual(get(bodyData, 0), data)) {
            gridInstanceRef.current.Data.Data.Body = [data || []];
            gridInstanceRef.current.ReloadBody();
        }
    }, [data]);

    return (
        <div style={{ height, width }}>
            <div id={id} className={className} style={omit(style, ['height', 'width'])} />
        </div>
    );
}

OwpTreeGrid.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    LayoutUrl: PropTypes.string,
    DataUrl: PropTypes.string,
    data: PropTypes.array,
    style: PropTypes.object,
    height: PropTypes.string,
    width: PropTypes.string,
    onMount: PropTypes.func,
};

OwpTreeGrid.defaultProps = {
    id: 'treeGridWrapper',
    className: '',
    LayoutUrl: '/assets/data/owp_000000Def.xml',
    DataUrl: '/assets/data/owp_000000Data.xml',
    style: {},
    height: '100%',
    width: '100%',
    onMount: () => {},
};

export default OwpTreeGrid;

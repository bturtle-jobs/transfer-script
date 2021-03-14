/**
 * @deprecated `owp/wrapper/OwpTreeGrid`를 사용해주세요.
 */
import isEmpty from 'lodash/isEmpty';
import { query } from 'owp/api';
import { getFlatNavigation } from 'owp/common/navigation';
import { mapDataToOwpPresetFormProps } from 'owp/components/Form/util';
import PropTypes from 'prop-types';
import {
    find,
    forEachObjIndexed,
    fromPairs,
    map,
    path,
    pipe,
    prop,
    propEq,
    props,
    toString,
    uniq,
} from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TreeGrid from './TreeGrid';
import TreeGridToolbar from './TreeGridToolbar';
import { changesAsJSON, getSelectedData, makeBatchData } from './util';

const treeGridBoolMap = {
    false: 0,
    true: 1,
};

const permissionBoolMap = {
    T: true,
    F: false,
};

function mapPermissions({
    C_PERMISSION = 'T',
    R_PERMISSION = 'T',
    // U_PERMISSION = 'T',
    D_PERMISSION = 'T',
} = {}) {
    return {
        C: !!permissionBoolMap[C_PERMISSION],
        R: !!permissionBoolMap[R_PERMISSION],
        U: !!permissionBoolMap[C_PERMISSION], // 등록 권한과 수정 권한은 현재 정책상 동일
        D: !!permissionBoolMap[D_PERMISSION],
    };
}

function useSuggestColumns(autocompleteColumns) {
    const [suggestColumns, setSuggestColumns] = useState({});

    useEffect(() => {
        forEachObjIndexed((value, key) => {
            query({ url: value.query.url })
                .then((data) => {
                    const { suggestions } = mapDataToOwpPresetFormProps({
                        dataKey: 'suggestions',
                        labelKey: 'Text',
                        valueKey: 'Name',
                    })(data);
                    const format = pipe(
                        map(props(['Name', 'Text'])),
                        fromPairs,
                        toString
                    )(suggestions);

                    setSuggestColumns((prevState) => {
                        return {
                            ...prevState,
                            [key]: {
                                Type: 'Text',
                                SuggestType: 'Search',
                                Suggest: {
                                    Items: suggestions,
                                },
                                Format: format,
                                EditFormat: format,
                            },
                        };
                    });
                })
                .catch((error) => {
                    console.log('TCL: error', error);
                });
        }, autocompleteColumns);
    }, [autocompleteColumns]);

    return suggestColumns;
}

function makeGridBatchData(grid, { rowIdKey, userSeq }) {
    return makeBatchData(changesAsJSON(grid.GetXmlData('changes,nogrid,noio')), {
        rowIdKey,
        userSeq,
    });
}

const OwpPresetTreeGrid = ({
    navigation,
    location,
    autocompleteColumns,
    rows,
    columns,

    rowIdKey,

    userSeq,

    // common props
    title,
    shouldShowToolbar,

    onSave,
    onSelect,
    onChange,

    ...restProps
}) => {
    const gridInstance = useRef(null);

    // permissions
    const permissions = pipe(
        getFlatNavigation,
        find(propEq('url', location.pathname)),
        prop('permission'),
        mapPermissions
    )(navigation);

    // autosuggest
    const suggestColumns = useSuggestColumns(autocompleteColumns);

    if (
        !isEmpty(autocompleteColumns) &&
        (isEmpty(suggestColumns) ||
            Object.keys(suggestColumns).length !== Object.keys(autocompleteColumns).length)
    ) {
        return null;
    }

    return (
        <>
            {shouldShowToolbar && (
                <TreeGridToolbar
                    title={title}
                    canAdd={permissions.C}
                    canEdit={permissions.U}
                    canDelete={permissions.D}
                    onAdd={() => {
                        gridInstance.current.ActionAddRowEnd(1);
                    }}
                    onAddCopy={() => {
                        gridInstance.current.ActionCopySelectedEnd(1);
                        gridInstance.current.ActionDeselectAll(1);
                    }}
                    onEdit={() => {}}
                    onDelete={() => {
                        gridInstance.current.ActionDeleteSelected(1);
                        gridInstance.current.ActionDeselectAll(1);
                    }}
                    onShowSettings={() => {
                        gridInstance.current.ActionShowColumns();
                    }}
                    onDownloadExcel={() => {
                        gridInstance.current.ActionExport();
                    }}
                    onSave={() => {
                        gridInstance.current.Save();
                    }}
                />
            )}
            <TreeGrid
                {...restProps}
                columns={columns}
                rows={rows}
                cfgOptions={{
                    Adding: treeGridBoolMap[permissions.C],
                    Editing: treeGridBoolMap[permissions.U],
                    Deleting: treeGridBoolMap[permissions.D],
                    ...(rowIdKey && {
                        IdNames: [rowIdKey],
                        AutoIdPrefix: `${rowIdKey}_`,
                    }),
                }}
                columnOptions={suggestColumns}
                onMount={(grid) => {
                    gridInstance.current = grid;
                }}
                onRowAdd={() => {}}
                onRowDelete={(g, row) => {}}
                onRowUndelete={(g, row) => {}}
                onSelect={(grid, row, deselect) => {
                    if (!!row.id) {
                        const selectedData = getSelectedData(
                            changesAsJSON(grid.GetXmlData('changes,selected,nogrid,noio')),
                            { rowIdKey }
                        );

                        const rowId = row.id.toString();
                        const newKey = rowIdKey || 'id';

                        const resultData = uniq(
                            deselect
                                ? selectedData.filter((selected) => selected[newKey] !== rowId)
                                : [{ [newKey]: rowId }, ...selectedData]
                        );

                        onSelect(resultData);
                    }
                }}
                onSave={(grid) => {
                    onSave(makeGridBatchData(grid, { rowIdKey, userSeq }));
                }}
                onChange={(grid) => {
                    onChange(makeGridBatchData(grid, { rowIdKey, userSeq }));
                }}
            />
        </>
    );
};

OwpPresetTreeGrid.propTypes = {
    /**
     * OWP 서비스로 호출된 데이터를 통해 검색가능한 셀렉트 박스 형식으로 표시 할 때 사용
     * 선언된 컬럼의 키 값을 기준으로 한다.
     */
    autocompleteColumns: PropTypes.objectOf(
        PropTypes.shape({
            query: PropTypes.shape({
                url: PropTypes.string.isRequired,
                params: PropTypes.object,
            }),
        })
    ),

    /**
     * 컬럼의 타입을 셀렉트 박스 형식으로 표시 할 때 사용
     * 선언된 컬럼의 키 값을 기준으로 한다.
     */
    selectColumns: PropTypes.objectOf(
        PropTypes.shape({
            labelKey: PropTypes.string.isRequired,
            valueKey: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.object).isRequired,
        })
    ),

    /**
     * 컬럼의 타입을 라디오 버튼 형식으로 표시 할 때 사용
     * 선언된 컬럼의 키 값을 기준으로 한다.
     */
    radioColumns: PropTypes.objectOf(
        PropTypes.shape({
            labelKey: PropTypes.string.isRequired,
            valueKey: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.object).isRequired,
        })
    ),

    // suggestColumns: PropTypes.object,

    /**
     * 셀(cell)의 타입을 셀렉트 박스 형식으로 표시 할 때 사용
     * 선언된 컬럼의 키 값을 기준으로 한다.
     */
    selectCells: PropTypes.objectOf(
        PropTypes.shape({
            labelKey: PropTypes.string.isRequired,
            valueKey: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.object).isRequired,
        })
    ),

    /**
     * 셀(cell)의 타입을 라디오 버튼 형식으로 표시 할 때 사용
     * 선언된 컬럼의 키 값을 기준으로 한다.
     */
    radioCells: PropTypes.objectOf(
        PropTypes.shape({
            labelKey: PropTypes.string.isRequired,
            valueKey: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(PropTypes.object).isRequired,
        })
    ),

    /**
     * Update, Delete 및 Select 경우 동적인 PK 를 처리하기 위해 사용
     * 선언된 PK 이름 (예: `OWP_Order_Panel.ORDERSEQ`) 을 기준으로 pk id 를 추출한다.
     */
    rowIdKey: PropTypes.string,

    /**
     * 툴바 타이틀
     */
    title: PropTypes.string,

    /**
     * 툴바 디스플레이 여부 플래그
     */
    shouldShowToolbar: PropTypes.bool,

    /**
     * TreeGrid의 Save 이벤트가 호출 된 후 실행
     *
     * @param {Array} object TreeGrid에서 CUD(Create, Update, Delete) 된 데이터들이 rest api 형식에 맞게 변경되서 전달 됨
     */
    onSave: PropTypes.func,

    /**
     * TreeGrid의 Checkbox 이벤트(click) 발생 시 실행
     *
     * @param {Array} object [{rowIdKey: "1"}, ...]
     */
    onSelect: PropTypes.func,

    /**
     * TreeGrid에서 CUD 발생 시 실행
     *
     * @param {Array} object TreeGrid에서 CUD(Create, Update, Delete) 된 데이터들이 rest api 형식에 맞게 변경되서 전달 됨
     */
    onChange: PropTypes.func,

    /**
     * @ignore
     */
    userSeq: PropTypes.number,
};

OwpPresetTreeGrid.defaultProps = {
    selectColumns: {},
    radioColumns: {},
    selectCells: {},
    radioCells: {},

    rowIdKey: null,

    userSeq: null,

    title: '',
    shouldShowToolbar: true,

    onSelect: () => {},
    onSave: () => {},
    onChange: () => {},
};

function mapStateToProps({ fuse, auth }) {
    return {
        navigation: fuse.navigation,
        userSeq: path(['user', 'data', 'userSeq'], auth),
    };
}

export default withRouter(connect(mapStateToProps)(OwpPresetTreeGrid));

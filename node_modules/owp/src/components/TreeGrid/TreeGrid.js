import { depr } from 'owp/debug';
import PropTypes from 'prop-types';
import React from 'react';
import { fetchAsText, makeColumnsFromGridLayout, transform } from './util';

function createGrid({
    id,
    gridData,
    gridUrl,
    layoutData,
    layoutUrl,

    // deprecated
    xml,
    dataUrl,

    ...TGData
}) {
    if (!!xml) {
        depr('`xml` prop는 deprecate 되었습니다. `gridData` prop을 사용 바랍니다..');
        gridData = xml;
    }

    if (!!dataUrl) {
        depr('`dataUrl` prop는 deprecate 되었습니다. `gridUrl` prop을 사용 바랍니다..');
        gridUrl = dataUrl;
    }

    let _gridInstance = window.TreeGrid(
        {
            Debug: '',
            Layout: { Data: layoutData, Url: layoutUrl },
            Data: {
                Data: gridData || makeTreeGridData(TGData),
                Url: gridUrl,
            },
        },
        id,
        id
    );

    function destroyInstance() {
        window.TGDelEvent(null, '');
        getInstance().Dispose();
        _gridInstance = null;
    }

    function getInstance() {
        return _gridInstance;
    }

    return {
        getInstance,
        destroyInstance,
    };
}

function log(...args) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
}

function makeTreeGridData({
    columns,
    rows,
    cfgOptions,
    defOptions,
    solidOptions,
    ...restTreeGridOptions
}) {
    const treeGridData = transform(columns, rows, restTreeGridOptions);

    return {
        ...treeGridData,
        Cfg: {
            // NoVScroll: 1,
            // MaxVScroll: 400,
            // RowIndex: 'NO',
            // RowIndexType: 6,
            Code: 'GTSEASWUCRTAW',
            ConstWidth: 1,
            ConstHeight: 1,
            Copying: 1,
            ColMoving: false,
            MaxHeight: 1,
            Dragging: false,
            ...cfgOptions,
        },
        Def: { ...defOptions },
        Solid: [
            ...solidOptions,
            // {
            //     Kind: 'Search',
            // },
        ],
        Toolbar: {
            Visible: 1,
            // Formula:
            //     '"전체 : "+count(7)+" / 추가 : "+count("Row.Added==1",7)+" / 수정 : "+count("Row.Changed==1",7)+" / 삭제 : "+count("Row.Deleted>0",7)+""',
            Add: 0,
            Export: 0,
            Scales: 0,
            Sizes: 0,
            Split: 0,
            Columns: 0,
            Help: 0,
            Debug: 0,
            Reload: 0,
            Styles: 0,
            AddChild: 0,
            Cfg: 0,
            Print: 0,
        },
    };
}

async function makeColumnsFromLayout({ layoutUrl, layoutData } = {}) {
    try {
        if (!!layoutUrl) {
            const xmlStr = await fetchAsText(layoutUrl);
            return makeColumnsFromGridLayout(xmlStr);
        }

        if (!!layoutData) {
            return makeColumnsFromGridLayout(layoutData);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 *
 *  @visibleName TreeGrid
 */
class ReactTreeGrid extends React.Component {
    _treeGrid = null;

    async componentDidMount() {
        const {
            onMount,
            onRowAdd,
            onRowDelete,
            onRowUndelete,
            onRowChange,
            onSave,
            onSelect,
            onChange,

            layoutUrl,
            layoutData,
        } = this.props;

        // set columns from grid layout
        const layoutColumns = await makeColumnsFromLayout({
            layoutUrl,
            layoutData,
        });

        this._treeGrid = createGrid({ ...this.props, layoutColumns });

        const treeGridId = this._treeGrid.getInstance().id;

        window.TGSetEvent('OnRowAdd', treeGridId, onRowAdd);
        window.TGSetEvent('OnRowDelete', treeGridId, onRowDelete);
        window.TGSetEvent('OnRowUndelete', treeGridId, onRowUndelete);
        window.TGSetEvent('OnAfterValueChanged', treeGridId, onRowChange);
        window.TGSetEvent('OnSelect', treeGridId, onSelect);
        window.TGSetEvent('OnSave', treeGridId, onSave);

        //onChange
        window.TGAddEvent('OnRowAdd', treeGridId, onChange);
        window.TGAddEvent('OnRowDelete', treeGridId, onChange);
        window.TGAddEvent('OnRowUndelete', treeGridId, onChange);
        window.TGAddEvent('OnAfterValueChanged', treeGridId, onChange);

        onMount(this._treeGrid.getInstance());
    }

    componentDidUpdate(prevProps) {
        // if (!isEqual(prevProps.columnOptions, this.props.columnOptions)) {
        //     console.log('fffff', this._treeGrid.getInstance());
        //     this._treeGrid.getInstance().Refresh(1);
        // }
    }

    componentWillUnmount() {
        this._treeGrid.destroyInstance();
    }

    get styles() {
        const style = {
            width: this.props.width,
            height: this.props.height,
            ...this.props.style,
        };

        return style;
    }

    get classes() {
        return this.props.className;
    }

    render() {
        return <div id={this.props.id} className={this.classes} style={this.styles} />;
    }
}

ReactTreeGrid.propTypes = {
    /**
     * TreeGrid가 마운트 되기 위한 타켓 DOM id와 TreeGrid의 고유 id로 사용
     */
    id: PropTypes.string,

    /**
     * TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 렌더링하고 싶을 때 사용
     * @link http://www.treegrid.com/Doc/Create.htm#Creating
     */
    gridData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    /**
     * 미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid를 렌더링하고 싶을 때 사용
     */
    gridUrl: PropTypes.string,

    /**
     * TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 TreeGrid의 레이아웃을 렌더링하고 싶을 때 사용
     */
    layoutData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    /**
     * 미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid 레이아웃을 렌더링하고 싶을 때 사용
     */
    layoutUrl: PropTypes.string,

    /**
     * 컬럼 데이터
     */
    columns: PropTypes.object,

    /**
     * 로우 데이터
     */
    rows: PropTypes.arrayOf(PropTypes.object),

    /**
     * width
     */
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * height
     */
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    style: PropTypes.object,
    className: PropTypes.string,

    /**
     * 컴포넌트가 마운트 된 후 실행
     *
     * @param {TreeGridInstance} treeGridInstance 생성된 TreeGrid의 인스턴스
     */
    onMount: PropTypes.func,

    /**
     * TreeGrid의 Save 이벤트가 호출 된 후 실행
     *
     * @param {Array} object TreeGrid에서 CUD(Create, Update, Delete) 된 데이터
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
     * @param {Array} object TreeGrid에서 CUD(Create, Update, Delete) 된 데이터
     */
    onChange: PropTypes.func,

    onRowAdd: PropTypes.func,
    onRowDelete: PropTypes.func,
    onRowChange: PropTypes.func,

    /**
     * @ignore
     */
    rowOptions: PropTypes.object,

    /**
     * @ignore
     */
    cfgOptions: PropTypes.object,

    /**
     * @ignore
     */
    defOptions: PropTypes.object,

    /**
     * @ignore
     */
    cellOptions: PropTypes.object,

    /**
     * @ignore
     */
    headOptions: PropTypes.array,

    /**
     * @ignore
     */
    solidOptions: PropTypes.array,

    /**
     *
     * @deprecated `gridData` prop 사용
     *
     * TreeGrid 데이터를 XML(string)로 핸들링 할 경우에 필요한 prop
     */
    xml: PropTypes.string,

    /**
     *
     * @deprecated `gridUrl` prop 사용
     *
     * TreeGrid 데이터를 xml url로 핸들링 할 경우에 필요한 prop
     */
    dataUrl: PropTypes.string,
};

ReactTreeGrid.defaultProps = {
    id: 'reactTreeGrid',

    xml: null,
    layoutUrl: null,
    dataUrl: null,

    columns: {},
    rows: [],

    style: {},
    width: '100%',
    height: '100%',

    rowOptions: {},
    cfgOptions: {},
    defOptions: {},
    cellOptions: {},
    headOptions: [],
    solidOptions: [],
    onMount: (gridInstance) => {},
    onRowAdd: log,
    onRowDelete: log,
    onRowChange: log,
    onSave: log,
    onSelect: log,
    onChange: log,
};

export default ReactTreeGrid;

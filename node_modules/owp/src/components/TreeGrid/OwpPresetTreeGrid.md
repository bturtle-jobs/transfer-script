## DEPRECATED (`owp/wrapper/OwpTreeGrid`를 사용해주세요.)

> #### OWP 서비스와 연결된(커플링된) 컴포넌트 제작 시 _`prefix`_ 가 _`OwpPreset...`_ 으로 작업하도록 한다

---

> #### Core Component: **[TreeGrid](/#treegrid)**
>
> -   [Core Component](/#treegrid) 에 명시된 _`props & method`_ 는 모두 적용 가능함.
>
> -   [로그인](https://github.com/leeinbae/owp/issues/31) 성공 후 유저 [권한 정보](https://github.com/leeinbae/owp/issues/21) 셋팅
>
> > 1. Navigation (with _CRUD_ Permission)
> > 2. User _Profile_
> > 3. _userSEQ_ (for **_Create_** OWP Service)

---

### OwpPresetTreeGrid 컴포넌트를 import:

```js static
import { OwpPresetTreeGrid } from 'owp/components';
```

---

### 상황에 따른 OwpPresetTreeGrid 사용 법

> > 1. **[CRUD 권한에 따른 OwpPresetTreeGrid](#1-crud---owppresettreegrid------owppresettreegrid----owppresettreegrid-)**
> >
> > 2. **[특정 컬럼을 select or radioColumns 적용](#2---select-or-radiocolumns-------owppresettreegrid----owppresettreegrid-)**
> >
> > 3. **[특정 컬럼에 autocompleteColumns 적용](#3---autocompletecolumns-------owppresettreegrid----owppresettreegrid-)**
> >
> > 4. **[동적으로 rowId(id) 를 세팅](#4--rowidid--------owppresettreegrid----owppresettreegrid-)**
> >
> > 5. **[CUD 동시 처리](#5-cud--------owppresettreegrid----owppresettreegrid-)**
> >
> > 6. **[layoutUrl with OWP 서비스](#6-layouturl-with-owp-------owppresettreegrid----owppresettreegrid-)**
> >
> > 7. **[onChange 활용 (with CUD)](#7-onchange--with-cud------owppresettreegrid----owppresettreegrid-)**

---

> #### 1. CRUD 권한에 따른 OwpPresetTreeGrid: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈: https://github.com/leeinbae/owp/issues/39

> > > -   `OwpPresetTreeGrid` 컴포넌트를 사용하면 내부에서 현재의 라우트(_ex: /pages/C100100_) 기준으로
> > >     유저별 권한에 따라 CRUD 버튼 노출 여부를 판단한다.
>
> > ##### 예제

```jsx static
import { OwpPresetTreeGrid } from 'owp/components';

const columns = {
    a: 'a',
    b: 'b',
    c: 'c',
};

const rows = [
    { a: 'a', b: 'b', c: 'c' },
    { a: 'a', b: 'b', c: 'c' },
    { a: 'a', b: 'b', c: 'c' },
];

<OwpPresetTreeGrid height={300} columns={columns} rows={rows} />;
```

---

> #### 2. 특정 컬럼을 select or radioColumns 적용: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈 : https://github.com/leeinbae/owp/issues/19
>
> > > -   _`selectColumns`_ 또는 _`radioColumns`_ _prop_ 을 아래와 같이 셋팅한다.

> > > ```json static
> > > {
> > >    labelKey: 'label', // data[obj] -> obj 에서 label 로 사용될 key
> > >    valueKey: 'value', // data[obj] -> obj 에서 value 로 사용될 key
> > >    data: [ { label: 'label', value: 'value' }, ... ]
> > > }
> > > ```
>
> > ##### 예제

```jsx static
import { OwpPresetTreeGrid, PageCarded } from 'owp/components';
import { queryAll } from 'owp/api';
import React, { Component } from 'react';

const columns = {
    'OWP_Panel.NAME': '품명',
    'OWP_Order_Panel.CODETYPE1': '규격',
    'OWP_Order_Panel.TOTALCNT': '길이',
    'OWP_InspectPerShipment.ORDER_MOUNT': '지시 매수(장)',
};

export default class OwpPresetTreeGridWithXXXColumns extends Component {
    state = {
        loading: true,
        rows: [],
        suggestions: [],
    };

    componentDidMount() {
        try {
            this.setState(
                {
                    loading: true,
                },
                async () => {
                    const data = await queryAll([
                        {
                            url: '/listOWP_JobOrder_Panel_LOTNO_Search', // rows
                            param: {}, // get params * optional
                        },
                        {
                            url: '/listCodeAC/D004000', // XXXColumns
                        },
                    ]);

                    const [rows, suggestions] = data;

                    this.setState({
                        loading: false,
                        rows,
                        suggestions,
                    });
                }
            );
        } catch (error) {
            console.error('error', error);
        }
    }

    render() {
        if (this.state.loading) {
            return null;
        }

        return (
            <PageCarded
                content={
                    <OwpPresetTreeGrid
                        height={300}
                        columns={columns}
                        rows={this.state.rows}
                        selectColumns={{
                            // selectColumns or radioColumns 선언
                            'OWP_Order_Panel.CODETYPE1': {
                                labelKey: 'IPX_CommonCode.CODENM',
                                valueKey: 'IPX_CommonCode.CODEID',
                                data: this.state.suggestions,
                            },
                        }}
                    />
                }
            />
        );
    }
}
```

---

> #### 3. 특정 컬럼에 autocompleteColumns 적용: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈: https://github.com/leeinbae/owp/issues/37
>
> > > -   autocomplete 컬럼을 사용 하기 위해서는 `autocompleteColumns` *prop*에 선언된 *column*의 키 값을 기준으로 하는
> > >     객체를 선언해준다.
> > >
> > >     > |               Prop name |    Type | Default |                          Description |
> > >     > | ----------------------: | ------: | ------: | -----------------------------------: |
> > >     > | **autocompleteColumns** | {shape} |         | query: shape **아래 json 원형 확인** |
>
> > > > ```json static
> > > > {
> > > >     [" OWP서비스 연동할 column 명 "]: {
> > > >         "query": {
> > > >             "url": " .../restService/ 이하 url ", // !!required
> > > >             "params": { param1: data, ... } // optional
> > > >         }
> > > >     }
> > > > }
> > > > ```
> >
> > ##### 예제

```jsx static
import { OwpPresetTreeGrid } from 'owp/components';

const columns = {
    a: 'a',
    b: 'b',
    c: 'c',
};

const rows = [
    { a: 'a', b: 'b', c: 'c' },
    { a: 'a', b: 'b', c: 'c' },
    { a: 'a', b: 'b', c: 'c' },
];

<OwpPresetTreeGrid
    height={300}
    columns={columns}
    rows={rows}
    autocompleteColumns={{
        a: {
            query: {
                url: '/listCodeAC/D004000',
            },
        },
    }}
/>;
```

---

> #### 4. 동적으로 rowId(id) 를 세팅: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**
>
> > 연관 이슈 : https://github.com/leeinbae/owp/issues/9
>
> > > **rowIdKey** _prop_ 을 선언 후 **pk** 명을 입력한다.

```jsx static
import { OwpPresetTreeGrid } from 'owp/components';

<OwpPresetTreeGrid
    shouldShowToolbar={false}
    id="setting-pk-grid"
    rowIdKey="CUSTOM.PK_SEQ"
    columns={{ NO: 'No', NAME: '이름' }}
    rows={[
        { 'CUSTOM.PK_SEQ': 1, NO: 1, NAME: '박준형' },
        { 'CUSTOM.PK_SEQ': 2, NO: 2, NAME: '서도형' },
    ]}
/>;
```

---

> #### 5. CUD 동시 처리: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈 : https://github.com/leeinbae/owp/issues/42
>
> > > -   CUD 처리된 데이터는 _`onSave`_ 이벤트 파라미터로 확인한다.

> > > > ```json static
> > > > [
> > > >    { STATUS: 'Create', ...data },
> > > >    { STATUS: 'Update', ['rowIdKey 에 셋팅된 key`]: '2', ...data },
> > > >    { STATUS: 'Delete', [`rowIdKey 에 셋팅된 key`]: '1', ...data },
> > > >    ...
> > > > ]
> > > > ```

> > > > > **주의** pk 를 id 로 추출하기 위해 반드시 [rowIdKey 에 pk 를 셋팅](#3--rowidid--------owppresettreegrid----owppresettreegrid-) 해야함.
>
> > ##### 예제

```jsx static
import { OwpPresetTreeGrid } from 'owp/components';
import { mutate } from 'owp/api';
import React from 'react';
import { Button } from '@material-ui/core';

const columns = {
    'IPX_CommonCode.GROUPNM': 'GROUP',
    'IPX_CommonCode.GROUPID': 'GROUPID',
    'IPX_CommonCode.CODENM': 'CODE',
    'IPX_CommonCode.CODEID': 'CODEID',
    'IPX_CommonCode_Price.UNITPRICE': 'UNITPRICE',
    'IPX_CommonCode.FLAG': 'FALG',
};

const rows = [
    {
        'IPX_CommonCode.GROUPID': 'Z000000',
        'IPX_CommonCode.GROUPNM': '테스트 그룹코드',
        'IPX_CommonCode.CODENM': '테스트코드222222222',
        'IPX_CommonCode.CODEID': 'Z000002',
        'IPX_CommonCode.FLAG': 'Y',
        'IPX_CommonCode.WUSERSEQ': '1',
        'IPX_CommonCode.LOGSEQ': '1',

        'IPX_CommonCode_Price.UNITPRICE': '20000',
        'IPX_CommonCode_Price.PRICESEQ': '0',
    },
    {
        'IPX_CommonCode.GROUPID': 'Z000000',
        'IPX_CommonCode.GROUPNM': '테스트 그룹코드',
        'IPX_CommonCode.CODENM': '테스트코드3',
        'IPX_CommonCode.CODEID': 'Z000003',
        'IPX_CommonCode.FLAG': 'Y',
        'IPX_CommonCode.WUSERSEQ': '1',
        'IPX_CommonCode.LOGSEQ': '1',

        'IPX_CommonCode_Price.UNITPRICE': '20000',
        'IPX_CommonCode_Price.PRICESEQ': '0',
    },
];

export default class OwpPresetTreeGridSample extends React.Component {
    constructor(props) {
        super(props);
    }

    handleEventAll = async (data) => {
        //TODO: 아래와 같이 CUD 를 처리한다.
        try {
            console.log('data', data);
            const result = await mutate({
                url: '/processIpxCommoncode', // Batch URL
                data,
            });
            console.log('result', result);
        } catch (error) {
            console.error('error', error);
        }
    };

    render() {
        // permission default: all TRUE
        return (
            <>
                <OwpPresetTreeGrid
                    columns={columns}
                    rows={rows}
                    rowIdKey="IPX_CommonCode.CODEID"
                    onSave={this.handleEventAll}
                />
            </>
        );
    }
}
```

---

> #### 6. layoutUrl with OWP 서비스: **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈 : https://github.com/leeinbae/owp/issues/62
>
> > > -   layoutUrl prop에 xml 또는 json 파일의 경로를 넣어서 TreeGrid 레이아웃을 생성 한다.
> > > -   rows prop에 _OWP_ 서비스 res data 를 셋팅한다.
> > > -   아래 예제에서 사용된 _OWP_ 서비스는 **C300200 (I/O 정의서: OWP_JobOrder_Panel_0007)** 이다.
>
> > ##### 예제

```jsx static
import { OwpPresetTreeGrid, PageCarded } from 'owp/components';
import { query } from 'owp/api';
import React, { Component } from 'react';

export default class OwpPresetTreeGridWithlayoutUrlSample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            loading: true,
        };
    }

    async componentDidMount() {
        try {
            // OWP 서비스를 통해 데이터를 가져온다.
            const rows = await query({
                url: '/listOWP_JobOrder_Panel_LOTNO_Search',
                param: {}, // get params * optional
            });
            this.setState({
                loading: false,
                rows,
            });
        } catch (error) {
            console.error('error', error);
        }
    }

    render() {
        if (this.state.loading) {
            return null;
        }

        return (
            <PageCarded
                content={
                    <OwpPresetTreeGrid
                        height={300}
                        rowIdKey="OWP_InspectPerShipment.OPSEQ"
                        layoutUrl="/assets/data/grid-sample-c300200-layout.xml"
                        rows={this.state.rows}
                    />
                }
            />
        );
    }
}
```

> #### 7. onChange 활용 (with CUD): **[ [↑ 메뉴로 돌아가기](#--owppresettreegrid--) / [처음으로](#owppresettreegrid) ]**

> > 연관 이슈 : https://github.com/leeinbae/owp/issues/67
>
> > > -   CUD 처리된 데이터는 _`onChange`_ 이벤트 파라미터로 확인한다.

> > > > ```json static
> > > > [
> > > >    { STATUS: 'Create', ...data },
> > > >    { STATUS: 'Update', ['rowIdKey 에 셋팅된 key`]: '2', ...data },
> > > >    { STATUS: 'Delete', [`rowIdKey 에 셋팅된 key`]: '1', ...data },
> > > >    ...
> > > > ]
> > > > ```

> > > > > **주의** pk 를 id 로 추출하기 위해 반드시 [rowIdKey 에 pk 를 셋팅](#3--rowidid--------owppresettreegrid----owppresettreegrid-) 해야함.
>
> > ##### 예제

```jsx static
import { Button } from '@material-ui/core';
import { OwpPresetTreeGrid, PageCarded } from 'owp/components';
import { mutate, query } from 'owp/api';
import React, { Component } from 'react';

class SampleActionComponent extends Component {
    handleSave = async () => {
        try {
            const { orderPanelData, handleSetData } = this.props;

            const data = {
                // sample
                'OWP_Order.ACCOUNTSEQ': '1',
                'OWP_Order.WUSERSEQ': '1',
                'OWP_Order.ORDERDATE': '2018-12-11',
                'OWP_Order.FLAG': 'Y',

                OWP_Order_Panel: orderPanelData,
            };

            const result = await mutate({
                url: '/batchUrl', // Batch URL
                data,
            });

            // reload
            handleSetData();

            console.log('result...', result);
        } catch (error) {
            console.error('error', error);
        }
    };

    render() {
        return (
            <Button fullWidth variant="contained" color="secondary" onClick={this.handleSave}>
                save
            </Button>
        );
    }
}

export default class OwpPresetTreeGridWithOnChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rowsOrderPanel: [],
            orderPanelData: [],
        };
    }

    componentDidMount() {
        this.setData();
    }

    setData = () => {
        try {
            this.setState(
                {
                    loading: true,
                },
                async () => {
                    const rowsOrderPanel = await query({
                        url: '/listOWP_JobOrder_Panel_LOTNO_Search',
                    });

                    this.setState({
                        loading: false,
                        rowsOrderPanel,
                    });
                }
            );
        } catch (error) {
            console.error('error', error);
        }
    };

    render() {
        return (
            <PageCarded
                contentList={[
                    {
                        content: (
                            <SampleActionComponent
                                orderPanelData={this.state.orderPanelData}
                                handleSetData={this.setData}
                            />
                        ),
                    },
                    {
                        // layoutUrl xml 사용
                        content: !this.state.loading && (
                            <OwpPresetTreeGrid
                                height={300}
                                rowIdKey="OWP_InspectPerShipment.OPSEQ"
                                layoutUrl="/assets/data/grid-sample-c300200-layout.xml"
                                rows={this.state.rowsOrderPanel}
                                onChange={(orderPanelData) => this.setState({ orderPanelData })}
                            />
                        ),
                    },
                ]}
            />
        );
    }
}
```

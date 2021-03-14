### TreeGrid 컴포넌트를 import:

```js static
import { TreeGrid } from 'owp/components';
```

---

### 1. [TreeGrid 컴포넌트를 생성하는 방법 (바로가기)](#treegrid---)

### 2. [상황에 따른 TreeGrid 사용 법 (바로가기)](#--treegrid--)

---

> #### TreeGrid 컴포넌트를 생성하는 방법

> > 1. **[기본적인 사용법](#1-------treegrid-----treegrid-)**
> >
> > 2. **[gridData (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 렌더링하고 싶을 때)](#2-griddata-treegrid-----xmlstring--json--------treegrid-----treegrid-)**
> >
> > 3. **[gridUrl (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid를 렌더링하고 싶을 때)](#3-gridurl----xml-json--treegrid-------treegrid-----treegrid-)**
> >
> > 4. **[layoutUrl with gridUrl (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid 레이아웃 및 데이터를 렌더링하고 싶을때)](#4-layouturl-with-gridurl----xml-json--treegrid---------treegrid-----treegrid-)**
> >
> > 5. **[layoutUrl with gridData (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid 레이아웃 및 XML(string) 또는 JSON 데이터를 이용하여 렌더링하고 싶을때)](#5-layouturl-with-griddata----xml-json--treegrid---xmlstring--json--------treegrid-----treegrid-)**
> >
> > 6. **[layoutData with gridUrl (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 레이아웃 및 미리 생성되어 있는 파일(XML, JSON)을 참조하여 데이터를 렌더링하고 싶을때)](#6-layoutdata-with-gridurl-treegrid-----xmlstring--json-------xml-json--------treegrid-----treegrid-)**
> >
> > 7. **[layoutData with gridData (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 레이아웃 및 데이터를 이용하여 렌더링하고 싶을때)](#7-layoutdata-with-griddata-treegrid-----xmlstring--json-----------treegrid-----treegrid-)**

---

> #### 1. 기본적인 사용 법: **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    columns={{ NO: 'No', NAME: '이름' }}
    rows={[
        { NO: 1, NAME: '박준형' },
        { NO: 2, NAME: '서도형' },
    ]}
/>;
```

---

> #### 2. gridData (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 렌더링하고 싶을 때): **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/24

> > -   **gridData** prop을 이용한 TreeGrid 생성
>
> > > gridData prop에 TreeGrid에서 사용되는 xml 또는 json 문자열을 추가 하여 생성 한다.
>
> > > 데이터 문자열 구성 시 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    id="gridData-grid"
    gridData="<Grid><Cfg Code='XXXXXXXXXXX'/><Cols><C Name='A'/></Cols><Body><B><I A='xxx'/></B></Body></Grid>"
/>;
```

---

> #### 3. gridUrl (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid를 렌더링하고 싶을 때): **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/24

> > -   **gridUrl** prop을 이용한 TreeGrid 생성

> > > gridUrl prop에 xml 또는 json 파일의 경로를 넣어서 TreeGrid를 생성 한다.
>
> > > 파일에는 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid shouldShowToolbar={false} id="gridUrl-grid" gridUrl="/assets/data/grid-sample.xml" />;
```

> #### 4. layoutUrl with gridUrl (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid 레이아웃 및 데이터를 렌더링하고 싶을때: **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/53

> > -   **layoutUrl**, **[gridUrl](#3-gridurl----xml-json--treegrid-------treegrid-----treegrid-)** props을 이용한 TreeGrid 생성

> > > layoutUrl, gridUrl props에 xml 또는 json 파일의 경로를 넣어서 TreeGrid를 생성 한다.
>
> > > layoutUrl 파일에는 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    id="layoutUrl-with-url-grid"
    layoutUrl="/assets/data/grid-layout-sample-layout.xml"
    gridUrl="/assets/data/grid-layout-sample-data.xml"
/>;
```

> #### 5. layoutUrl with gridData (미리 생성되어 있는 파일(XML, JSON)을 참조하여 TreeGrid 레이아웃 및 XML(string) 또는 JSON 데이터를 이용하여 렌더링하고 싶을때): **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/53

> > -   **layoutUrl**, **[gridData](#2-griddata-treegrid-----xmlstring--json--------treegrid-----treegrid-)** props을 이용한 TreeGrid 생성

> > > layoutUrl prop에 xml 또는 json 파일의 경로를 넣어서 TreeGrid 레이아웃을 생성 한다.
>
> > > gridData prop에 TreeGrid 데이터 구조에 미리 맞춰진 xml(string) 또는 json을 넣어서 데이터를 생성 한다.
>
> > > layoutUrl 파일에는 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    id="layoutUrl-with-data-grid"
    layoutUrl="/assets/data/grid-layout-sample-layout.xml"
    gridData='<Grid><Body><B><I id="1" R="Central & South Asia" C="ARMENIA" N="3"/><I id="2" R="Central & South Asia" C="AZERBAIJAN" N="4"/></B></Body></Grid>'
/>;
```

> #### 6. layoutData with gridUrl (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 레이아웃 및 미리 생성되어 있는 파일(XML, JSON)을 참조하여 데이터를 렌더링하고 싶을때): **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/53

> > -   **layoutData**, **[gridUrl](#3-gridurl----xml-json--treegrid-------treegrid-----treegrid-)** props을 이용한 TreeGrid 생성

> > > layoutData prop에 TreeGrid 데이터 구조에 미리 맞춰진 xml(string) 또는 json 으로 레이아웃을 생성 한다.
>
> > > gridUrl prop에 xml 또는 json 파일의 경로를 넣어서 TreeGrid 데이터를 생성 한다.
>
> > > layoutData 데이터에는 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    id="layoutData-with-url-grid"
    layoutData='<Grid><Cfg id="Basic"/><Cfg Code="XXXXXXXXXXX" /><Cols><C Name="DATA1"/><C Name="DATA2"/></Cols></Grid>'
    gridUrl="/assets/data/grid-layout-sample-data-simple.xml"
/>;
```

> #### 7. layoutData with gridData (TreeGrid 데이터 구조에 미리 맞춰진 XML(string) 또는 JSON을 사용하여 레이아웃 및 데이터를 이용하여 렌더링하고 싶을때): **[ [↑ 메뉴로 돌아가기](#treegrid---) / [처음으로](#treegrid) ]**
>
> > 연관 이슈: https://github.com/leeinbae/owp/issues/53

> > -   **layoutData**, **gridData** props을 이용한 TreeGrid 생성

> > > layoutData, gridData props에 TreeGrid 데이터 구조에 미리 맞춰진 xml(string) 또는 json 으로 레이아웃을 생성 한다.
>
> > > layoutData 데이터에는 **`<Cfg Code='XXXXXXXXXXX'/>`** 또는 **`{ Cfg: { Code: 'XXXXXXXXXXX' }}`** 가 포함되어야 함.
> > >
> > > > **XXXXXXXXXXX** 는 Treegrid 라이선스 Code

```jsx static
import { TreeGrid } from 'owp/components';

<TreeGrid
    shouldShowToolbar={false}
    id="layoutData-with-data-grid"
    layoutData='<Grid><Cfg id="Basic"/><Cfg Code="XXXXXXXXXXX" /><Cols><C Name="DATA1"/><C Name="DATA2"/></Cols></Grid>'
    gridData='<Grid><Body><B><I DATA1="4" DATA2="5"/><I DATA1="7" DATA2="8"/></B></Body></Grid>'
/>;
```

---

> #### 상황에 따른 TreeGrid 사용 법

> > 1. [Query (GET) 데이터로 TreeGrid 를 생성할때](#1-query-get--treegrid--------treegrid----treegrid-)
> > 2. [단일 컴포넌트에서 N 개의 Query (GET) 데이터로 N 개의 TreeGrid 를 생성할때](#2---n--query-get--n--treegrid--------treegrid----treegrid-)

---

> #### 1. Query (GET) 데이터로 TreeGrid 를 생성할때: **[ [↑ 메뉴로 돌아가기](#--treegrid--) / [처음으로](#treegrid) ]**
>
> > 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125
>
> > > **query** 함수를 이용하여 **fetch** 한다.

```jsx static
import React from 'react';
import { TreeGrid } from 'owp/components';
import { query } from 'owp/api';

const columns = {
    'OWP_Panel.NAME': '품명',
    'OWP_Order_Panel.CODETYPE1_NM': '규격',
    'OWP_Order_Panel.TOTALCNT': '길이',
    'OWP_InspectPerShipment.ORDER_MOUNT': '지시 매수(장)',
};

class TreeGridWithQuery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
        };
    }

    componentDidMount() {
        query({
            url: '/listOWP_JobOrder_Panel_LOTNO_Search',
            param: {},
        })
            .then((data) => this.setState({ rows: data }))
            .catch((error) => console.error(error));
    }

    render() {
        if (!this.state.rows) {
            return null;
        }

        return <TreeGrid shouldShowToolbar={false} columns={columns} rows={this.state.rows} />;
    }
}

export default TreeGridWithQuery;
```

---

> #### 2. 단일 컴포넌트에서 N 개의 Query (GET) 데이터로 N 개의 TreeGrid 를 생성할때: **[ [↑ 메뉴로 돌아가기](#--treegrid--) / [처음으로](#treegrid) ]**
>
> > 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125
>
> > > **queryAll** 함수를 이용하여 **fetch** 한다.

```jsx static
import React from 'react';
import { TreeGrid } from 'owp/components';
import { queryAll } from 'owp/api';

const panelColumns = {
    'OWP_Panel.NAME': '품명',
    'OWP_Order_Panel.CODETYPE1_NM': '규격',
    'OWP_Order_Panel.TOTALCNT': '길이',
    'OWP_InspectPerShipment.ORDER_MOUNT': '지시 매수(장)',
};

const deptColumns = {
    CODEID: 'NO',
    CODENM: '부서명',
    FLAG: '사용여부',
};

class TreeGridWithQueryAll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
        };
    }

    componentDidMount() {
        queryAll([
            {
                url: '/listOWP_JobOrder_Panel_LOTNO_Search',
                param: {},
            },
            {
                url: '/listIPX_CommonCodeDeptAC',
                param: {},
            },
        ])
            .then((data) => this.setState({ rows: data }))
            .catch((error) => console.error('error...', error));
    }

    render() {
        if (!this.state.rows) {
            return null;
        }

        const [panelData, deptData] = this.state.rows;

        return (
            <>
                <TreeGrid
                    shouldShowToolbar={false}
                    id="panel-grid"
                    columns={panelColumns}
                    rows={panelData}
                />
                <TreeGrid
                    shouldShowToolbar={false}
                    id="dept-grid"
                    columns={deptColumns}
                    rows={deptData}
                />
            </>
        );
    }
}

export default TreeGridWithQueryAll;
```

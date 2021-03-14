#### Core Component: **[react-pivottable](https://github.com/plotly/react-pivottable)**

> -   [Core Component](https://github.com/plotly/react-pivottable#properties-and-layered-architecture) 에 명시된 _`props`_ 는 모두 적용 가능함.

---

### PivotTable 컴포넌트를 import:

```js static
import { PivotTable } from 'owp/components';
```

---

### PivotTable 컴포넌트를 생성하는 방법

> > 1. **[DataURL 설정 예제](#1-dataurl------pivottable-----pivottable-)**
> > 2. **[Drag N Drop 설정 예제](#2-drag-n-drop------pivottable-----pivottable-)**
> > 3. **[Data Array 설정 예제](#3-data-array------pivottable-----pivottable-)**

---

> #### 1. DataURL 설정 예제: **[ [↑ 메뉴로 돌아가기](#pivottable---) / [처음으로](#pivottable) ]**

```jsx static
import { PivotTable } from 'owp/components';
import React from 'react';

const PivotTableWithDataURL = (props) => {
    return (
        <PivotTable
            dataURL="/assets/sample/pivot_table.xlsx" // or with public domain origin ex) https://.../sample.xlsx
        />
    );
};

export default PivotTableWithDataURL;
```

> #### 2. Drag N Drop 설정 예제: **[ [↑ 메뉴로 돌아가기](#pivottable---) / [처음으로](#pivottable) ]**

```jsx static
import { PivotTable } from 'owp/components';
import React from 'react';

const PivotTableWithDragNDrop = (props) => {
    return <PivotTable />;
};

export default PivotTableWithDragNDrop;
```

> #### 3. Data Array 설정 예제: **[ [↑ 메뉴로 돌아가기](#pivottable---) / [처음으로](#pivottable) ]**

```jsx static
import { PivotTable } from 'owp/components';
import React from 'react';

const SAMPLE_DATA = [
    {
        'No.': 1,
        '데이터 수집 일시': '2019/04/21 01:01',
        제조번호: 'AFF812',
        품목번호: 11516,
        공정명: '세척',
        설비명: '세척기',
        설비코드: 'WAS-10001',
        데이터항목: '순환수 온도',
        '데이터 값': 63,
        단위: 'oC',
    },
    {
        'No.': 2,
        '데이터 수집 일시': '2019/04/22 02:02',
        제조번호: 'AFF812',
        품목번호: 11516,
        공정명: '세척',
        설비명: '세척기',
        설비코드: 'WAS-10001',
        데이터항목: '순환수 온도',
        '데이터 값': 60,
        단위: 'oC',
    },
    {
        'No.': 3,
        '데이터 수집 일시': '2019/04/23 03:03',
        제조번호: 'AFF812',
        품목번호: 11516,
        공정명: '세척',
        설비명: '세척기',
        설비코드: 'WAS-10001',
        데이터항목: '순환수 온도',
        '데이터 값': 60,
        단위: 'oC',
    },
];

const PivotTableWithData = (props) => {
    return <PivotTable data={SAMPLE_DATA} />;
};

export default PivotTableWithData;
```

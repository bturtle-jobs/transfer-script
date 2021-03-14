> #### OWP 서비스와 연결된(커플링된) 컴포넌트 제작 시 _`prefix`_ 가 _`OwpPreset...`_ 으로 작업하도록 한다

---

> #### Core Component: **[PivotTable](/#pivottable)**
>
> -   [Core Component](/#pivottable) 에 명시된 _`props & method`_ 는 모두 적용 가능함.
>
> -   **OwpPresetPivotTable** 에 아래 추가된 _`props`_ 을 통해 OWP 서비스 연동.

> > | Prop name |   Type | Default |         Description |
> > | --------: | -----: | ------: | ------------------: |
> > | **query** | Object |      {} | 아래 json 원형 확인 |
>
> > ```json static
> > {
> >    "url": " .../restService/ 이하 url ", // !!required
> >    "params": { param1: data, ... } // optional
> > }
> > ```

---

### OwpPresetPivotTable 컴포넌트를 import:

```js static
import { OwpPresetPivotTable } from 'owp/components';
```

---

### OwpPresetPivotTable 컴포넌트를 생성하는 방법

> > 1. **[서비스 연동 예제](#1-------owppresetpivottable-----owppresetpivottable-)**

---

> #### 1. 서비스 연동 예제: **[ [↑ 메뉴로 돌아가기](#owppresetpivottable---) / [처음으로](#owppresetpivottable) ]**

```jsx static
import { OwpPresetPivotTable } from 'owp/components';
import React, { Component } from 'react';

class OwpPresetPivotTableSample extends Component {
    render() {
        return <OwpPresetPivotTable query={{ url: '/service_url_here', params: {...} }} />;
    }
}

export default OwpPresetPivotTableSample;
```

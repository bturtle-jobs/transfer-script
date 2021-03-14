> #### OWP 서비스와 연결된(커플링된) 컴포넌트 제작 시 _`prefix`_ 가 _`OwpPreset...`_ 으로 작업하도록 한다

> 연관이슈: https://github.com/leeinbae/owp/issues/44

---

> #### Core Component: **[RadioFormGroup](/#radioformgroup)**
>
> -   [Core Component](/#radioformgroup) 에 명시된 _`props & method`_ 는 모두 적용 가능함.
>
> -   **OwpPresetRadioFormGroup** 에 아래 추가된 _`props`_ 을 통해 OWP 서비스 연동.

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
>
> -   OWP서비스로 연동된 데이터는 아래와 같이 맵핑된다.
>
> > ```json static
> > { "label": IPX_CommonCode.CODENM, "value": IPX_CommonCode.CODEID }
> > ```
> >
> > **_또는_**
> >
> > ```json static
> > { "label": CODENM, "value": CODEID }
> > ```
>
> -   선택된 데이터는 _`onChange`_ 이벤트 파라미터로 확인한다.
>
> > String: _value_ data

---

### OwpPresetRadioFormGroup 컴포넌트를 import:

```js static
import { OwpPresetRadioFormGroup } from 'owp/components';
```

---

### OwpPresetRadioFormGroup 컴포넌트를 생성하는 방법

> > 1. **[서비스 연동 예제 (with 공통코드)](#1----with-----owppresetradioformgroup-----owppresetradioformgroup-)**

---

> #### 1. 서비스 연동 예제 (with 공통코드): **[ [↑ 메뉴로 돌아가기](#owppresetradioformgroup---) / [처음으로](#owppresetradioformgroup) ]**
>
> > **예제로 사용된 API**
>
> > > **I/O 정의서 ID:** IPX_CommonCode_0020
>
> > > **페이지명:** [공통] 모든 화면의 라디오박스

```jsx static
import { OwpPresetRadioFormGroup } from 'owp/components';
import React from 'react';

const OwpPresetRadioFormGroupSample = () => {
    return (
        <OwpPresetRadioFormGroup
            query={{ url: `/listCodeAC/D004000` /* params: {} */ }}
            onChange={(value) => console.log('value', value)}
        />
    );
};

export default OwpPresetRadioFormGroupSample;
```

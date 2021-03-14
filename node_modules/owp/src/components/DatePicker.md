#### Core Component: **[material-ui TextField](https://material-ui.com/api/text-field/#props)**

> -   [Core Component](https://material-ui.com/api/text-field/#props) 에 명시된 _`props`_ 는 모두 적용 가능함.
>
> -   단, **type** _prop_ 은 `date` 고정.
>
> -   선택된 데이터는 _`onChange`_ 이벤트 파라미터로 확인한다.
>
> > ```js static
> > // String: 2019-04-10
> > ```

---

### DatePicker 컴포넌트를 import:

```js static
import { DatePicker } from 'owp/components';
```

---

### DatePicker 컴포넌트를 생성하는 방법

> > 1. **[기본 예제](#1------datepicker-----datepicker-)**

---

> #### 1. 기본 예제: **[ [↑ 메뉴로 돌아가기](#datepicker---) / [처음으로](#datepicker) ]**

```jsx static
import { DatePicker } from 'owp/components';
import React from 'react';

const DatePickerSampleComponent = () => {
    return <DatePicker label="시작일" onChange={(date) => console.log('date...', date)} />;
};

export default DatePickerSampleComponent;
```

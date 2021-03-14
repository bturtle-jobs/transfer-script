## [◁ 돌아가기](/README.md)
<br/><br/>

## INDEX


 ## 1. 공통 Components
 
-   ### [OwpButton](#owpbutton-top)
-   ### [OwpDateTimePicker](#owpdatetimepicker-top)
-   ### [OwpDateTimePickerMulti](#owpdatetimepickermulti-top)
-   ### [OwpMonthPicker](#owpmonthpicker-top)
-   ### [OwpMonthPickerMulti](#owpmonthpickermulti-top)
-   ### [OwpYearPicker](#owpyearpicker-top)
-   ### [OwpAutoComplete](#owpautocomplete-top)
-   ### [OwpCheckBox](#owpcheckbox-top)
-   ### [OwpRadioGroup](#owpradiogroup-top)
-   ### [OwpTextField](#owptextfield-top)
-   ### [OwpSelectField](#owpselectfield-top)

<br/>

  ## 2. 검색 Header Components

-   ### [OwpSearchHeader](#owpsearchheader-top)
-   ### [OwpSearchForm](#owpsearchform-top)


<br/><br/>

---

# OwpButton ([↑ TOP](#index))

Button 컴포넌트

### Props (OwpButton)

| Prop      |  Type  | <div style="width: 400px;">Description</div>                                   |
| :-------- | :----: | :----------------------------------------------------------------------------- |
| className | string | `Default: ''`                                                               |
| style     | object | `Default: {}`                                                                  |
| fullWidth |  bool  | `Default: false`                                                               |
| variant   | string | enum: 'text', 'outlined', 'contained' , 'flat', 'raised' `Default: 'outlined'` |
| color     | string | enum: 'default', 'inherit', 'primary', 'secondary' `Default: 'primary'`        |
| size      | string | enum: 'small', 'medium', 'large' `Default: 'small'`                            |
| type      | string | `Default: ''`                                                               |
| disabled      | bool | `Default: false`                                                               |
| delay   | number | animate delay `Default: 300`                                                               
| onClick   | object | `(event) : void`                                                               |

### Usage (OwpButton)

```jsx
import { OwpButton } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpButton extends Component {
    render() {
        return (
            <OwpButton fullWidth variant="contained" color="secondary">
                <Typography>버튼</Typography>
            </OwpButton>
        );
    }
}

export default SampleOwpButton;
```

---

# OwpDateTimePicker ([↑ TOP](#index))

DateTime Picker 컴포넌트

-   YYYY-MM-DD HH:mm:ss

### Props (OwpDateTimePicker)


| Prop         |           Type           | <div style="width: 400px;">Description</div>                                                            |
| :----------- | :----------------------: | :------------------------------------------------------------------------------------------------------ |
| className    |          string          | `Default: ''`                                                                                        |
| name         |          string          | `Default: 'owp-datetime-picker'`                                                                        |
| label        |          node          | `Default: '기준일'`                                                                                     |
| align   | string | enum: 'left', 'center', 'right'<br/>**date time align** <br/> `Default: 'left'` |
| defaultValue | string or mement or Date | default input value<br/>string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''`            |
| value        | string or mement or Date | string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''`                                             |
| required     |           bool           | 입력 필수 여부 (form only) `Default: false`                                                             |
| fullWidth    |           bool           | `Default: false`                                                                                        |
| initNow      |           bool           | 현재 시로 초기화 `Default: false`                                                                       |
| fullDate     |           bool           | ▶ true 인 경우 / input: YYYY-MM-DD **HH:mm** `Default: false`                                      |
| useHour      |           bool           | ▶ true 인 경우 / input: YYYY-MM-DD **HH** `Default: false`                                         |
| useSecond    |           bool           | ▶ true 인 경우 / input: YYYY-MM-DD HH:mm:**ss** `Default: false`                                   |
| useClear     |           bool           | 입력 clear 버튼 활성화 `Default: true`                                                                  |
| usePicker    |           bool           | 캘린더 버튼 활성화<br/> ▶ false 인 경우 / input 클릭 시 캘린더 활성화 `Default: true`              |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| useValidate  |           bool           | 미래 일 (오늘 이후) 날짜 선택 불가능 여부 `Default: true`                                               |
| pickerSize     |           string           | picker size 변환<br/> 현재 축소만 가능함.<br/> enum: 'sm'<br/> `Default: undefined`                                                             |
| inputRef     |      func or object      | `React.createRef()` ref. `Default: null`                                                                |
| inputProps   |          object          | `input` 엘레먼트 props `Default: {}`                                                                    |
| errorMessage |          string          | `Default: ''`                                                                                        |
| onChange     |           func           | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void`                |

### Usage (OwpDateTimePicker)

```jsx
import { OwpDateTimePicker } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpDateTimePicker extends Component {
    render() {
        return (
            <OwpDateTimePicker
                initNow
                label="Date Time Picker"
                inputProps={{ style: { width: 250 } }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpDateTimePicker;
```

---

# OwpDateTimePickerMulti ([↑ TOP](#index))

DateTime Picker (Start To End) 컴포넌트

-   YYYY-MM-DD HH:mm:ss, YYYY-MM-DD HH:mm:ss

### Props (OwpDateTimePickerMulti)

| Prop              |  Type  | <div style="width: 400px;">Description</div>                                                                                                             |
| :---------------- | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className         | string | `Default: ''`                                                                                                                                         |
| name              | string | `Default: 'owp-datetime-picker-multi'`                                                                                                                   |
| labels            | object | { start: `node`, end: `node` } `Default: { start: '시작일', '종료일' }`                                                                              |
| defaultValues            | object | default input value<br/>{ start: `string or mement or Date` , end: `string or mement or Date` }<br/>string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: { start: '', end: '' }` |
| values            | object | { start: `string or mement or Date` , end: `string or mement or Date` }<br/>string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: { start: '', end: '' }` |
| required          |  bool  | 입력 필수 여부 (form only) `Default: false`                                                                                                              |
| initNow           |  bool  | 현재 시로 초기화 `Default: false`                                                                                                                        |
| fullWidth         |  bool  | `Default: false`                                                                                                                                         |
| fullDate          |  bool  | ▶ true 인 경우 / input: YYYY-MM-DD **HH:mm** `Default: false`                                                                                       |
| useHour           |  bool  | ▶ true 인 경우 / input: YYYY-MM-DD **HH** `Default: false`                                                                                          |
| useSecond         |  bool  | ▶ true 인 경우 / input: YYYY-MM-DD HH:mm:**ss** `Default: false`                                                                                    |
| useClear          |  bool  | 입력 clear 버튼 활성화 `Default: true`                                                                                                                   |
| usePicker         |  bool  | 캘린더 버튼 활성화<br/> ▶ false 인 경우 / input 클릭 시 캘린더 활성화 `Default: true`                                                               |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| useValidate       |  bool  | 미래 일 (오늘 이후) 날짜 선택 불가능 여부 `Default: true`                                                                                                |
| useForceChange       |  bool  | 변경된 날짜 상시 전달 (유효성 무시) `Default: true`                                                                                                |
| useFilterSameDate |  bool  | 시작/종료일이 같은 경우 Error 처리 여부 `Default: false`                                                                                                 |
| inputProps        | object | `input` 엘레먼트 props<br/> { start: `input element props`, end: `input element props` } `Default: { start: {}, end: {} }`                               |
| onChange          |  func  | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void`                                                                 |

### Usage (OwpDateTimePickerMulti)

```jsx
import { OwpDateTimePickerMulti } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpDateTimePickerMulti extends Component {
    render() {
        return (
            <OwpDateTimePickerMulti
                initNow
                labels={{ start: 'start', end: 'end' }}
                inputProps={{ start: { style: { width: 250 } }, end: { style: { width: 250 } } }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpDateTimePickerMulti;
```

---

# OwpMonthPicker ([↑ TOP](#index))

Month Picker 컴포넌트

-   YYYY-MM-DD HH:mm:ss
-

### Props (OwpMonthPicker)

| Prop | Type | <div style="width: 400px;">Description</div> |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string | `Default: ''` |
| name | string | `Default: 'owp-month-picker'` |
| label | node | `Default: '기준월'` |
| defaultValue | string or mement or Date | default input value<br/> string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''`            |
| value | string or mement or Date | string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''` |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| initNow | bool | 현재 월로 초기화 `Default: false` |
| fullWidth | bool | `Default: false` |
| useKr | bool | `YYYY년 MM월` 출력 해야하는 경우 선언 `Default: false` |
| useClear | bool | 입력 clear 버튼 활성화 `Default: true` |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| inputRef | func or object | `React.createRef()` ref. `Default: null` |
| inputProps | object | `input` 엘레먼트 props<br/> `Default: {}` |
| errorMessage | string | `Default: ''` |
| onChange | func | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void` |

### Usage (OwpMonthPicker)

```jsx
import { OwpMonthPicker } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpMonthPicker extends Component {
    render() {
        return (
            <OwpMonthPicker
                initNow
                label="month"
                inputProps={{ style: { width: 250 } }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpMonthPicker;
```

---

# OwpMonthPickerMulti ([↑ TOP](#index))

Month Picker (Start To End) 컴포넌트

-   YYYY-MM-DD HH:mm:ss, YYYY-MM-DD HH:mm:ss

### Props (OwpMonthPickerMulti)

| Prop         |  Type  | <div style="width: 400px;">Description</div>                                                                                                             |
| :----------- | :----: | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className    | string | `Default: ''`                                                                                                                                         |
| name         | string | `Default: 'owp-month-picker-multi'`                                                                                                                      |
| labels       | object | { start: `node`, end: `node` } `Default: { start: '시작월', '종료월' }`                                                                              |
| defaultValues            | object | default input value<br/>{ start: `string or mement or Date` , end: `string or mement or Date` }<br/>string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: { start: '', end: '' }` |
| values       | object | { start: `string or mement or Date` , end: `string or mement or Date` }<br/>string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: { start: '', end: '' }` |
| required     |  bool  | 입력 필수 여부 (form only) `Default: false`                                                                                                              |
| initNow      |  bool  | 현재 월로 초기화 `Default: false`                                                                                                                        |
| fullWidth    |  bool  | `Default: false`                                                                                                                                         |
| useClear     |  bool  | 입력 clear 버튼 활성화 `Default: true`                                                                                                                   |
| usePicker    |  bool  | 캘린더 버튼 활성화<br/> ▶ false 인 경우 / input 클릭 시 캘린더 활성화 `Default: true`                                                               |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| useFilterSameMonth |  bool  | 시작/종료월이 같은 경우 Error 처리 여부 `Default: false`                                                                                                 |
| inputProps   | object | `input` 엘레먼트 props<br/> { start: `input element props`, end: `input element props` } `Default: { start: {}, end: {} }`                               |
| errorMessage | string | `Default: ''`                                                                                                                                         |
| onChange     |  func  | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void`                                                                 |

### Usage (OwpMonthPickerMulti)

```jsx
import { OwpMonthPickerMulti } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpMonthPickerMulti extends Component {
    render() {
        return (
            <OwpMonthPickerMulti
                initNow
                labels={{ start: 'start', end: 'end' }}
                inputProps={{ start: { style: { width: 250 } }, end: { style: { width: 250 } } }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpMonthPickerMulti;
```

---

# OwpYearPicker ([↑ TOP](#index))

Year Picker 컴포넌트

-   YYYY-MM-DD HH:mm:ss
-

### Props (OwpMonthPicker)

| Prop | Type | <div style="width: 400px;">Description</div> |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string | `Default: ''` |
| name | string | `Default: 'owp-year-picker'` |
| label | node | `Default: '기준연도'` |
| defaultValue | string or mement or Date | default input value<br/> string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''`            |
| value | string or mement or Date | string 인 경우: `YYYY-MM-DD HH:mm:ss`<br/> `Default: ''` |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| initNow | bool | 현재 월로 초기화 `Default: false` |
| fullWidth | bool | `Default: false` |
| useClear | bool | 입력 clear 버튼 활성화 `Default: true` |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| inputRef | func or object | `React.createRef()` ref. `Default: null` |
| inputProps | object | `input` 엘레먼트 props<br/> `Default: {}` |
| errorMessage | string | `Default: ''` |
| onChange | func | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void` |

### Usage (OwpMonthPicker)

```jsx
import { OwpYearPicker } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpYearPicker extends Component {
    render() {
        return (
            <OwpYearPicker
                initNow
                label="year"
                inputProps={{ style: { width: 250 } }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpYearPicker;
```

---

# OwpAutoComplete ([↑ TOP](#index))

검색형 Select 컴포넌트

### Props (OwpAutoComplete)

| Prop           |  Type  | <div style="width: 400px;">Description</div>                                                                                                                                                           |
| :------------- | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className      | string | `Default: ''`                                                                                                                                                                                       |
| name           | string | `Default: 'owp-search-auto-complete'`                                                                                                                                                                  |
| style          | object | `Default: {}`                                                                                                                                                                                          |
| label | node | `Default: ''` |
| placeholder    | object | `Default: ''`                                                                                                                                                                                          |
| defaultInputValue    | string | 선언 시 해당 질의어를 통한 결과 `options` 에서 `value` prop = `options`[0] 으로 셋팅함 `Default: null`                                                                                                                                                                                          |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| minInputLength | number | 검색 최소 문자 길이 `Default: 2`                                                                                                                                                                       |
| isMulti        | object | 여러개 선택 가능 여부 `Default: false`                                                                                                                                                                 |
| query          | object | `params` object 는 query 원형 입력<br/> 검색에 사용될 `target value` 는 `''` 로 선언되야함. <br/> `Ex) { url: '/Service', params: { targetKey: '' // 검색 대상 value 는 '' string 처리해야함, option1: 'value' }` `Default: {}` |
| onInputChange  |  func  | 입력한 검색 문자열 `(string) : void`                                                                                                                                                                   |
| onChange       |  func  | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void`                                                                                                               |

### Usage (OwpAutoComplete)

```jsx
import { OwpAutoComplete } from 'owp/wrapper';
import Typography from '@material-core/Typography';

import React, { Component } from 'react';

class SampleOwpAutoComplete extends Component {
    render() {
        return (
            <OwpAutoComplete
                isMulti
                placeholder="검색어 입력"
                query={{
                    url: '/serviceUrl',
                    params: {
                        targetKey: '', // 검색어가 처리될 target Value 는 '' string 처리해야함.
                        options: 'options', // 추가 조건 처리
                    },
                }}
                onChange={(event, value) => console.log(event.target.value, value)}
            />
        );
    }
}

export default SampleOwpAutoComplete;
```

---

# OwpCheckBox ([↑ TOP](#index))

CheckBox 컴포넌트

### Props (OwpCheckBox)

| Prop | Type | <div style="width: 400px;">Description</div> |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string |  `Default: ''` |
| name | string |  `Default: 'owp-checkbox'` |
| label | node | `Default: ''` |
| optionLabel | string | Checkbox Item 라벨  `Default: ''` |
| optionLabelPlacement | string |  Checkbox Item 위치<br/>▶ enum: 'end',  'start' ,  'top' ,  'bottom' `Default: 'end'` |
| defaultValue | array`<string>` or string | default input value  `Default: []` |
| value | bool or string | input value  `Default: false` |
| required | bool | 입력 필수 여부 (form only)<br/> `options` prop 선언 시 사용 가능 `Default: false` |
| disabled      | bool | `Default: false`                                                               |
| options | array | Checkbox Options<br/> `optionLabel`, `optionLabelPlacement` prop 은 해당 prop 선언 시 무시됨<br/> [{ label: 'item label', value: 'item value', labelPlacement: 'end' // option }, ...] `Default: []` |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| isRow | bool | 정렬 기준<br/>false 시 column  `Default: true` |
| errorMessage | string |  `Default: ''` |
| onChange | func | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) * `options` prop 선언한 경우 -> `,` 구분자 string value `(event, value) : void` |

### Usage (OwpCheckBox * single *required 지원 X)

```jsx
import { OwpCheckBox } from 'owp/wrapper';

import React, { Component } from 'react';

class SampleOwpCheckBox extends Component {
    render() {
        return (
            <OwpOwpCheckBox
                label="Checkbox Label"
                optionLabel="Item Label"
                optionLabelPlacement="end"
                onChange={(event, checked) => console.log(event.target.checked, checked)}
            />
        );
    }
}

export default SampleOwpCheckBox;
```

### Usage (OwpCheckBox * use options *required 지원 O)

```jsx
import { OwpCheckBox } from 'owp/wrapper';

import React, { Component } from 'react';

class SampleOwpCheckBox extends Component {
    render() {
        return (
            <OwpOwpCheckBox
                required
                label="Checkbox Label"
                options={[
                    { label: '1', value: 'a' },
                    { label: '2', value: 'b' },
                ]}
                onChange={(event, checked) => console.log(event.target.checked, checked)}
            />
        );
    }
}

export default SampleOwpCheckBox;
```

---

# OwpRadioGroup ([↑ TOP](#index))

Radio Group 컴포넌트

### Props (OwpRadioGroup)

| Prop | Type | <div style="width: 400px;">Description</div> |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string |  `Default: ''` |
| name | string |  `Default: 'owp-radio-group'` |
| label | node | `Default: ''` |
| optionLabelPlacement | string |  Radio Item 위치<br/>▶ enum: 'end',  'start' ,  'top' ,  'bottom' `Default: 'end'` |
| defaultValue | string | default input value  `Default: ''` |
| value | string | input value  `Default: ''` |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| disabled      | bool | `Default: false`                                                               |
| options<br/>_(required)_ | array | Radio Options<br/> [{ label: 'item label', value: 'item value' }, ...] `Default: []` |
| useReset | bool | 초기화 모드 사용 여부  `Default: false` |
| isRow | bool | 정렬 기준<br/>false 시 column  `Default: true` |
| errorMessage | string |  `Default: ''` |
| onChange | func | ▶ 첫번째 파라미터: event<br/>▶두번째 파라미터: value (선택된 값) `(event, value) : void` |

### Usage (OwpRadioGroup)

```jsx
import { OwpRadioGroup } from 'owp/wrapper';

import React, { Component } from 'react';

class SampleOwpRadioGroup extends Component {
    render() {
        return (
            <OwpRadioGroup
                label="RadioGroup Label"
                defaultValue="a"
                options={[
                    { label: '1', value: 'a' },
                    { label: '2', value: 'b' },
                ]}
                onChange={(event, selected) => console.log(event.target.value, selected)}
            />
        );
    }
}

export default SampleOwpRadioGroup;
```

---

# OwpTextField ([↑ TOP](#index))

Radio Group 컴포넌트

### Props (OwpTextField)

| Prop | Type | <div style="width: 400px;">Description</div> |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string |  `Default: ''` |
| name | string |  `Default: 'owp-textfield'` |
| label | node | `Default: ''` |
| placeholder | string |  placeholder `Default: ''` |
| defaultValue | string | default input value  `Default: ''` |
| value | string | input value  `Default: ''` |
| variant | string | enum: 'standard', 'outlined', 'filled'  `Default: 'standard'` |
| type | string | HTML5 input type  `Default: 'text'` |
| rows | string or number | rows |
| rowsMax | string or number | rows max |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| onChange | func | event<br/>`(event) : void` |

### Usage (OwpTextField)

```jsx
import { OwpTextField } from 'owp/wrapper';

import React, { Component } from 'react';

class SampleOwpTextField extends Component {
    render() {
        return (
            <OwpTextField
                label="TextField"
                onChange={(event) => console.log(event.target.value)}
            />
        );
    }
}

export default SampleOwpTextField;
```
---

# OwpSelectField ([↑ TOP](#index))

Select 컴포넌트

### Props (OwpSelectField)

| Prop             |     Type      | <div style="width: 400px;">Description</div>                                                                                                                                                                                                              |
| :--------------- | :-----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className | string |  `Default: ''` |
| name | string |  `Default: 'owp-select-field'` |
| value | string or number | select value  `Default: ''` |
| removeDefaultOption | false | remove default option (first node)  `Default: false` |
| emptyOptionLabel | string or node | empty option 라벨 (first node)<br/> `removeDefaultOption` prop -> `false` && `useAll` prop 미선언시 사용 가능  `Default: ''` |
| isMulti        | object | 여러개(multiple) 선택 가능 여부 * 선언 시 `removeDefaultOption` prop 은 무시함.  `Default: false`                                                                                                                                                                 |
| required | bool | 입력 필수 여부 (form only) `Default: false` |
| useAll | bool | 전체 선택 `Default: false` |
| useCheckboxMenuWithMenu | bool | option 메뉴에 체크박스 출력 `Default: true` |
| mapper | object | { label: 'label 키 입력', value: 'value 키 입력' }<br/> `Default: { label: 'label', value: 'value' }` |
| groupId | string | group ID (with common codes) `Default: ''` |
| query | object | * `groupId` prop 선언 시 `groupId` first<br/>{ url: '/serviceUrl' params: { jsondata: ... } } `Default: {}` |
| options | array | * `groupId` or `query` prop 선언 시 `groupId` or `query` first<br/> `mapper` prop 기준 select item data  `Default: []` |
| onChange | func | event<br/>두번째 파라미터 { `value`: 선택된 value, `data`: query prop 이용한 경우 선택된 value 가 포함된 object }<br/>`(event, { value, data }) : void` |

* `options` prop 또는 `groupId` prop 선언으로 메뉴 아이템 생성 시
    - `[{ ..., disabled: true  }, ...]`  `disabled == true` 인 경우 해당 아이템 `disabled`

### Usage (OwpSelectField / use `groupId` prop)

```jsx
import { OwpSelectField } from 'owp/wrapper';

import React, { Component } from 'react';

class SamplOwpSelectField extends Component {
    render() {
        return (
            <OwpSelectField
                name="SelectField"
                groupId="D12345"
                onChange={(event) => console.log(event.target.name, event.target.value)}
            />
        );
    }
}

export default SampleOwpSelectField;
```

### Usage (OwpSelectField / use `query` prop)

```jsx
import { OwpSelectField } from 'owp/wrapper';

import React, { Component } from 'react';

class SamplOwpSelectField extends Component {
    render() {
        return (
            <OwpSelectField
                name="SelectField"
                query={{ url: 'serviceUrl', params: { jsondata: .... } }}
                mapper={{ label: 'IMPIX.LABEL', value: 'IMPIX.VALUE' }}
                onChange={(event, { value, data }) => console.log(
                    event.target.name, 
                    event.target.value,
                    value, // 선택된 value
                    data, // 선택된 object data (query prop 사용한 경우만 해당)
                    )}
            />
        );
    }
}

export default SampleOwpSelectField;
```

### Usage (OwpSelectField / use `options` prop)

```jsx
import { OwpSelectField } from 'owp/wrapper';

import React, { Component } from 'react';

class SamplOwpSelectField extends Component {
    render() {
        return (
            <OwpSelectField
                name="SelectField"
                options={[{ label: 1, value: 1 }, ...]}
                onChange={(event) => console.log(event.target.name, event.target.value)}
            />
        );
    }
}

export default SampleOwpSelectField;
```

---

# OwpSearchHeader ([↑ TOP](#index))

TreeGrid 검색 Header 컴포넌트

### Props (OwpSearchHeader)

| Prop                 |  Type   | <div style="width: 400px;">Description</div>                                                                                                                                   |
| :------------------- | :-----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url<br/>_(required)_ | string  | 검색 시 사용할 Service Url 입력 `Ex) '/ServiceUrl'`                                                                                                                            |
| gridId               | string  | 연동할 TreeGrid ID 입력 `Default: ''`                                                                                                                                       |
| gridIndex            | number  | 연동할 TreeGrid index 입력 `Default: 0`                                                                                                                                        |
| autoSubmit           | boolean | `url` prop 선언 시 적용 가능.<br/> 컴포넌트 바인딩 시 연동된 TreeGrid 에 Service Data 맵핑 `Default: false`                                                                    |
| subUrl               | string  | 검색 시 사용할 Sub Service Url 입력 `Default: ''`                                                                                                                           |
| subKeyName           | string  | 검색 시 사용할 Sub Param Key 입력 `Default: ''`                                                                                                                             |
| subValName           | string  | 검색 시 사용할 Sub Value Key (use Row Data) 입력 `Default: ''`                                                                                                              |
| showResetButton      | boolean | 초기화 버튼 출력 여부 `Default: true`                                                                                                                                          |
| onBeforeSubmit       |  func   | 검색 전 처리 함수<br/> 첫번째 변수로 Search Params (`JSON`) 확인. <br/> return `false` 인 경우 -> break. `(params) : boolean or null`                                                                                            |
| onSubmit         |     func      | 검색 후 결과 확인<br/> 첫번째 변수로 Search Params (`JSON`) 확인. `(result, params) : void`                                                                                                   |
| onReset              |  func   | 초기화 후 처리 함수 `() : void`                                                                                                                                                |
| onDataGet            |  func   | [TreeGrid OnDataGet 참조](http://www.treegrid.com/Doc/DataCommunication.htm?Mark=onDataGet#OnDataGet) `(rowData: Json) : boolean or null`                                                 |
| OnGetExportValue     |  func   | [TreeGrid OnGetExportValue 참조](http://www.treegrid.com/Doc/Export.htm?Mark=OnGetExportValue#OnGetExportValue) `(column: string, value: string or number) : string or number` |
| onMount              |  func   | 생성된 검색 입력 및 버튼 refs 마운트 `(refs: { formsy: inputs, submitButton, resetButton }) : void`                                                                            |
| onError              |  func   | Error 핸들링 `(error: JSON) : void`                                                                                                                                            |

### Usage (OwpSearchHeader)

```jsx
import { OwpPageCarded, OwpSearchHeader, OwpSearchSelectField } from 'owp/wrapper';
import React, { Component } from 'react';

class SampleOwpSearchHeader extends Component {
    render() {
        return (
            <OwpPageCarded
                header={
                    <OwpSearchHeader
                        autoSubmit
                        gridIndex={0}
                        url="/ServiceUrl"
                        onBeforeSubmit={(params) => console.log(params)}
                        onReset={() => {}}
                    >
                        <OwpSearchSelectField name="PARAM1" />
                    </OwpSearchHeader>
                }
            />
        );
    }
}

export default SampleOwpSearchHeader;
```

---

# OwpSearchForm ([↑ TOP](#index))

검색 Header 컴포넌트

### Props (OwpSearchForm)

| Prop             |     Type      | <div style="width: 400px;">Description</div>                                                                                                                                                                                                              |
| :--------------- | :-----------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url              |    string     | 검색에 사용될 Service Url `Ex) '/ServiceUrl'`                                                                                                                                                                                                             |
| urls             | array<string> | ▶ Service Params 가 동일한 경우 사용. <br/> 검색에 사용될 Serivce Url 을 Array 로 선언. 결과 값은 `onSubmit` 파라미터 1번째 인수로 확인. 선언한 Array index 와 매칭되어 결과 값 생성됨.<br/>`url` prop 선언된 경우 무시됨. <br/> `Ex) ['/Service1', '/Service2']` |
| autoSubmit       |     bool      | `url` 또는 `urls` prop 선언 시 적용 가능.<br/> 컴포넌트 바인딩 시 연동된 Service Url(s) 호출 `Default: false`                                                                                                                                             |
| isReady          |     bool      | 검색 버튼 활성화 처리 `Default: true`                                                                                                                                                                                                                     |
| showSearchButton |     bool      | 검색 버튼 출력 여부 `Default: true`                                                                                                                                                                                                                       |
| showResetButton  |     bool      | 초기화 버튼 출력 여부 `Default: true`                                                                                                                                                                                                                     |
| onBeforeSubmit   |     func      | 검색 전 처리 함수<br/> 첫번째 인수로 Search Params (`JSON`) 확인. <br/> return `false` 인 경우-> break. `(params) : boolean or null`                                                                                                                                                                       |
| onSubmit         |     func      | 검색 후 결과 확인<br/> ▶ 첫번째 파라미터: 검색 결과 (`array` 또는 `object`)<br/> ▶ 두번째 파라미터: Search Params (`JSON`) \_ `(result, params) : void`                                                                                                   |
| onReset          |     func      | 초기화 후 처리 함수 `() : void`                                                                                                                                                                                                                           |
| onMount          |     func      | 생성된 검색 입력 및 버튼 refs 마운트 `(refs: { formsy: inputs, submitButton, resetButton }) : void`                                                                                                                                                       |
| onError          |     func      | Error 핸들링 `(error: JSON) : void`                                                                                                                                                                                                                       |

### Usage (OwpSearchForm)

```jsx
import { OwpPageCarded, OwpSearchForm, OwpSearchSelectField } from 'owp/wrapper';

import React, { Component } from 'react';

class SampleOwpOwpSearchForm extends Component {
    render() {
        return (
            <OwpPageCarded
                header={
                    <OwpSearchForm
                        autoSubmit
                        url="/ServiceUrl"
                        // urls={["/ServiceUrl_1", "/ServiceUrl_2"]}
                        onBeforeSubmit={(params) => console.log(params)}
                        onSubmit={(result, params) => console.log(result, params)}
                        onReset={() => {}}
                    >
                        <OwpSearchSelectField name="PARAM1" />
                    </OwpSearchForm>
                }
            />
        );
    }
}

export default SampleOwpOwpSearchForm;
```



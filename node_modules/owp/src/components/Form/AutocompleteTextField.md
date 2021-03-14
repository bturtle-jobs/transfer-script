#### Core Component: **[react-select](https://react-select.com/props)**

> -   [Core Component](https://react-select.com/props) 에 명시된 _`props`_ 는 모두 적용 가능함.
>
> -   선택된 데이터는 _`onChange`_ 이벤트 파라미터로 확인한다.
>
> > 1. _isMulti_ 가 아닌 경우
>
> > > ```json static
> > > // object
> > > { "label": node, "value": string }
> > > ```
>
> > 2. _isMulti_ 인 경우
>
> > > ```js static
> > > // object[]
> > > [{ "label": node, "value": string }, ...]
> > > ```

---

### AutocompleteTextField 컴포넌트를 import:

```js static
import { AutocompleteTextField } from 'owp/components';
```

---

### AutocompleteTextField 컴포넌트를 생성하는 방법

> > 1. **[기본예제 (한개 선택)](#1-------autocompletetextfield-----autocompletetextfield-)**
> > 2. **[기본 예제 (N개 선택 - multi)](#2--n----multi----autocompletetextfield-----autocompletetextfield-)**
> > 3. **[서비스 연동 예제 (with 공통코드)](#3----with-----autocompletetextfield-----autocompletetextfield-)**

---

> #### 1. 예제 (한개 선택): **[ [↑ 메뉴로 돌아가기](#autocompletetextfield---) / [처음으로](#autocompletetextfield) ]**

```jsx static
import { AutocompleteTextField } from 'owp/components';

class AutocompleteTextFieldExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            suggestions: [
                { label: '김민준' },
                { label: '이서준' },
                { label: '박예준' },
                { label: '김도윤' },
                { label: '이주원' },
                { label: '박시우' },
                { label: '김지후' },
                { label: '이준서' },
                { label: '박지호' },
                { label: '하하준' },
                { label: '정현우' },
                { label: '김준우' },
                { label: '심지훈' },
                { label: '박도현' },
                { label: '송건우' },
                { label: '공우진' },
                { label: '이현준' },
                { label: '박민재' },
                { label: '정선우' },
                { label: '진서진' },
                { label: '서연우' },
                { label: '용정우' },
                { label: '박준혁' },
                { label: '유승현' },
                { label: '오유준' },
                { label: '송지환' },
                { label: '서승우' },
                { label: '김승민' },
                { label: '김민성' },
                { label: '정시윤' },
                { label: '임지우' },
                { label: '이준영' },
                { label: '어유찬' },
                { label: '홍진우' },
            ].map((suggestion) => ({
                value: suggestion.label,
                label: suggestion.label,
            })),
        };
    }

    render() {
        return (
            <>
                <AutocompleteTextField
                    value={this.state.userName}
                    suggestions={this.state.suggestions}
                    onChange={(userName) => {
                        this.setState({ userName });
                        console.log('userName', userName);
                    }}
                />
                <h3>value: {this.state.userName.value}</h3>
            </>
        );
    }
}

<AutocompleteTextFieldExample />;
```

> #### 2. 예제 (N개 선택 - multi): **[ [↑ 메뉴로 돌아가기](#autocompletetextfield---) / [처음으로](#autocompletetextfield) ]**

> > 관련 이슈 : https://github.com/leeinbae/owp/issues/41

```jsx static
import { AutocompleteTextField } from 'owp/components';

class AutocompleteTextFieldMultiExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userNames: [],
            suggestions: [{ label: '김민준' }, { label: '이서준' }, { label: '박예준' }].map(
                (suggestion) => ({
                    value: suggestion.label,
                    label: suggestion.label,
                })
            ),
        };
    }

    render() {
        return (
            // isMulti 선언시 N개 아이템 선택 가능
            <>
                <AutocompleteTextField
                    isMulti
                    value={this.state.userNames}
                    suggestions={this.state.suggestions}
                    onChange={(userNames) => {
                        this.setState({ userNames });
                        console.log('userNames', userNames);
                    }}
                />
                <h3>value: {this.state.userNames.map(({ value }) => value).join(',')}</h3>
            </>
        );
    }
}

<AutocompleteTextFieldMultiExample />;
```

> #### 3. 서비스 연동 예제 (with 공통코드): **[ [↑ 메뉴로 돌아가기](#autocompletetextfield---) / [처음으로](#autocompletetextfield) ]**

> > 관련 이슈: https://github.com/leeinbae/owp/issues/19#issuecomment-461758160
>
> > 관련 이슈: https://github.com/leeinbae/owp/issues/37#issuecomment-462646347
>
> > > **예제로 사용된 API**
>
> > > > **I/O 정의서 ID:** IPX_CommonCode_0020
>
> > > > **페이지명:** [공통] 모든 화면의 셀렉트박스 (AutoComplete)

```jsx static
import { AutocompleteTextField } from 'owp/components';
import { query } from 'owp/api';
import React from 'react';

export default class AutocompleteTextFieldExampleWithService extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            suggestions: [],
            value: {},
        };
    }

    componentDidMount() {
        query({
            url: '/listCodeAC/D004000',
        })
            .then((result) =>
                this.setState({
                    suggestions: result.map((suggestion) => ({
                        label: suggestion['IPX_CommonCode.CODENM'],
                        value: suggestion['IPX_CommonCode.CODEID'],
                    })),
                })
            )
            .catch((error) => console.error('error...', error));
    }

    render() {
        return (
            <AutocompleteTextField
                value={this.state.value}
                suggestions={this.state.suggestions}
                onChange={(value) => {
                    this.setState({ value });
                    console.log('value.obj', value);
                }}
            />
        );
    }
}
```

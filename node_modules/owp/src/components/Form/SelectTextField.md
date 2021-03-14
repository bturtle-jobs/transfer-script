#### Core Component: **[material-ui TextField](https://material-ui.com/api/text-field/#props)**

> -   [Core Component](https://material-ui.com/api/text-field/#props) 에 명시된 _`props`_ 는 모두 적용 가능함.
>
> -   선택된 데이터는 _`onChange`_ 이벤트 파라미터로 확인한다.
>
> > String: _value_ data

---

### SelectTextField 컴포넌트를 import:

```js static
import { SelectTextField } from 'owp/components';
```

---

### SelectTextField 컴포넌트를 생성하는 방법

> > 1. **[기본 예제](#1-----selecttextfield-----selecttextfield-)**
> > 2. **[서비스 연동 예제 (with 공통코드)](#2----with-----selecttextfield-----selecttextfield-)**

---

> #### 1. 기본 예제: **[ [↑ 메뉴로 돌아가기](#selecttextfield---) / [처음으로](#selecttextfield) ]**

```jsx static
import React from 'react';
import { SelectTextField } from 'owp/components';

const response = {
    resultData: [
        {
            'IPX_CommonCode.DESCRIPTION': '',
            'IPX_CommonCode.CODEID': 'D044001',
            'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
            'IPX_CommonCode.GROUPID': 'D044000',
            'IPX_CommonCode.CODENM': '시스템관리자',
            'IPX_CommonCode.FLAG': 'Y',
        },
        {
            'IPX_CommonCode.DESCRIPTION': '',
            'IPX_CommonCode.CODEID': 'D044003',
            'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
            'IPX_CommonCode.GROUPID': 'D044000',
            'IPX_CommonCode.CODENM': '운영관리자',
            'IPX_CommonCode.FLAG': 'Y',
        },
        {
            'IPX_CommonCode.DESCRIPTION': '',
            'IPX_CommonCode.CODEID': 'D044004',
            'IPX_CommonCode.GROUPNM': '공통_[권한관리]',
            'IPX_CommonCode.GROUPID': 'D044000',
            'IPX_CommonCode.CODENM': '일반사용자',
            'IPX_CommonCode.FLAG': 'Y',
        },
    ],
    resultCode: 'STATUS_1',
    resultMessage: '처리되었습니다.',
};

class SelectTextFieldExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectValue: 'D044001',
        };

        this.items = response.resultData.map((item) => ({
            label: item['IPX_CommonCode.CODENM'],
            value: item['IPX_CommonCode.CODEID'],
        }));
    }

    render() {
        return (
            <>
                <SelectTextField
                    label="공통코드"
                    onChange={(value) => {
                        this.setState({
                            selectValue: value,
                        });

                        console.log('value', value);
                    }}
                    value={this.state.selectValue}
                    items={this.items}
                />

                <h3>value: {this.state.selectValue}</h3>
            </>
        );
    }
}

<SelectTextFieldExample />;
```

> #### 2. 서비스 연동 예제 (with 공통코드): **[ [↑ 메뉴로 돌아가기](#selecttextfield---) / [처음으로](#selecttextfield) ]**
>
> > **예제로 사용된 API**
>
> > > **I/O 정의서 ID:** IPX_CommonCode_0020
>
> > > **페이지명:** [공통] 모든 화면의 셀렉트박스

```jsx static
import { SelectTextField } from 'owp/components';
import { query } from 'owp/api';
import React from 'react';

export default class SelectTextFieldExampleWithService extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectValue: [],
        };
    }

    componentDidMount() {
        query({
            url: '/listCodeAC/D004000',
        })
            .then((result) =>
                this.setState({
                    items: result.map((item) => ({
                        label: item['IPX_CommonCode.CODENM'],
                        value: item['IPX_CommonCode.CODEID'],
                    })),
                })
            )
            .catch((error) => console.error('error...', error));
    }

    render() {
        return (
            <>
                <SelectTextField
                    label="공통코드"
                    onChange={(values) => {
                        this.setState({
                            selectValue: values,
                        });

                        console.log('values', values);
                    }}
                    value={this.state.selectValue}
                    items={this.state.items}
                />
                <h3>value: {this.state.selectValue}</h3>
            </>
        );
    }
}
```

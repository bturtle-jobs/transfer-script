#### Core Component: **[Go](https://gojs.net/latest/api/index.html)**

---

### GoTimeline 컴포넌트를 import:

```js static
import { GoTimeline } from 'owp/components';
```

---

### GoTimeline 컴포넌트를 생성하는 방법

> #### **1 Day (24h)** 기준 생성

> #### 기본 예제 (with OWP Service): **[ [↑ 메뉴로 돌아가기](#gotimeline---) / [처음으로](#gotimeline) ]**

> > **예제로 사용된 API**
>
> > > **I/O 정의서 ID:** listOwpProcessalarm (?? 문서 반영 X / Slack DM 으로 전달 받음)

```jsx static
import { GoTimeline, makeGoTimelineModel } from 'owp/components';
import { query } from 'owp/api';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

class GoTimelineSample extends React.Component {
    state = {
        model: [],
    };

    async componentDidMount() {
        try {
            const data = await query({
                url: '/listOwpProcessalarm',
            });

            this.setState({
                model: makeGoTimelineModel(data), // makeGoTimelineModel 를 이용하여 model object 생성
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (isEmpty(this.state.model)) {
            return null;
        }

        return <GoTimeline model={this.state.model} />;
    }
}

export default GoTimelineSample;
```

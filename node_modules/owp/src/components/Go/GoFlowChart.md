### Core Component: **[Go](https://gojs.net/latest/api/index.html)**

---

### GoFlowChart 컴포넌트를 import:

```js static
import { GoFlowChart } from 'owp/components';
```

---

### GoFlowChart 컴포넌트를 생성하는 방법

> #### 기본 예제: **[ [↑ 메뉴로 돌아가기](#goflowchart---) / [처음으로](#goflowchart) ]**

```jsx static
import { GoFlowChart } from 'owp/components';
import React from 'react';

const GoFlowChartSample = () => {
    return (
        <GoFlowChart
            paletteModel={[
                { category: 'Start', text: '시작' },
                { category: 'Step', text: '프로세스' },
                { category: 'Conditional', text: '조건' },
                { category: 'End', text: '종료' },
                { category: 'Comment', text: '커멘트' },
            ]}
            diagramModel={{
                nodeDataArray: [],
                linkDataArray: [],
            }}
        />
    );
};

export default GoFlowChartSample;
```

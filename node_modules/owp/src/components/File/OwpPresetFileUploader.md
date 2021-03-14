### OwpPresetFileUploader 컴포넌트를 import:

```js static
import { OwpPresetFileUploader } from 'owp/components';
```

---

### OwpPresetFileUploader 컴포넌트를 생성하는 방법

> > 1. **[Button 예제](#1-button-----owppresetfileuploader-----owppresetfileuploader-)**
> > 1. **[Drag & Drap 예제](#2-drag--drap-----owppresetfileuploader-----owppresetfileuploader-)**

---

> #### 1. Button 예제: **[ [↑ 메뉴로 돌아가기](#owppresetfileuploader---) / [처음으로](#owppresetfileuploader) ]**

```jsx static
import { OwpPresetFileUploader } from 'owp/components';
import React from 'react';

const OwpPresetFileUploaderSampleButton = () => {
    return (
        <OwpPresetFileUploader
            pageId="C600200"
            ButtonComponentProps={{
                variant: 'contained',
                color: 'primary',
                children: '파일 업로드',
            }}
            onComplete={(data) => {
                console.log('TCL: C600200 -> render -> data', data);
            }}
            onError={(error) => {
                console.log('TCL: C600200 -> render -> error', error);
            }}
        />
    );
};

export default OwpPresetFileUploaderSampleButton;
```

---

> #### 2. Drag & Drap 예제: **[ [↑ 메뉴로 돌아가기](#owppresetfileuploader---) / [처음으로](#owppresetfileuploader) ]**

```jsx static
import { OwpPresetFileUploader } from 'owp/components';
import React from 'react';

const OwpPresetFileUploaderDndSample = () => {
    return (
        <OwpPresetFileUploader
            componentType="dnd"
            pageId="C600200"
            onComplete={(data) => {
                console.log('TCL: C600200 -> render -> data', data);
            }}
            onError={(error) => {
                console.log('TCL: C600200 -> render -> error', error);
            }}
        />
    );
};

export default OwpPresetFileUploaderDndSample;
```

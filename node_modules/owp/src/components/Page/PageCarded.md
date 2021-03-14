참고:

-   http://react-material.fusetheme.com/components/fuse/fuse-page-carded
-   src/@fuse/components/FusePageLayouts/FusePageCarded.js

### 한개의 카드 섹션만 필요 할 때:

```jsx static
import { PageCarded } from 'owp/components';

const ContentToolbar1 = () => <h1>Content Toolbar 1</h1>;
const Content1 = () => <p>Content 1</p>;

<PageCarded contentToolbar={<ContentToolbar1 />} content={<Content1 />} />;
```

### 여러개(2개 이상)의 카드 섹션이 필요 할 때:

```jsx static
import { PageCarded } from 'owp/components';

const ContentToolbar1 = () => <h1>Content Toolbar 1</h1>;
const ContentToolbar2 = () => <h1>Content Toolbar 2</h1>;
const Content1 = () => <p>Content 1</p>;
const Content2 = () => <p>Content 2</p>;

<PageCarded
    contentList={[
        {
            contentToolbar: <ContentToolbar1 />,
            content: <Content1 />,
        },
        {
            contentToolbar: <ContentToolbar2 />,
            content: <Content2 />,
        },
    ]}
/>;
```

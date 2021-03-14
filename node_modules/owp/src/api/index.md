### CRUD 함수를 import:

```js static
import { query, queryAll, mutate } from 'owp/api';
```

**아래는 CRUD RestApi 핸들링을 위한 sample code 입니다.**

### 1. CREATE:

```jsx static
import { mutate } from 'owp/api';
import { Button } from '@material-ui/core';
import React from 'react';

export default class CreateSample extends React.Component {
    handleCreate = async () => {
        try {
            const result = await mutate({
                url: '/createApi'
                data: {
                    'IPX.name': 'name',
                }
            });

            console.log('result', result);
        } catch(error) {
            console.error('create.error', error);
        }
    };

    render() {
        return <Button onClick={this.handleCreate}>생성</Button>
    }
};
```

### 2. CREATE (Batch):

> > 관련이슈: https://github.com/leeinbae/owp/issues/9#issuecomment-459669017

```jsx static
import { mutate } from 'owp/api';
import { Button } from '@material-ui/core';
import React from 'react';

export default class CreateBatchSample extends React.Component {
    handleCreate = async () => {
        try {
            const result = await mutate({
                url: '/batchApi'
                data: [
                    {
                        STATUS: 'Create',
                        id: '_',
                        A: '추가',
                        B: '추가',
                    },
                    {
                        STATUS: 'Update',
                        id: '20',
                        A: '수정함',
                    },
                    {
                        STATUS: 'Delete',
                        id: '19'
                    }
                ]
            });

            console.log('result', result);
        } catch(error) {
            console.error('create.error', error);
        }
    };

    render() {
        return <Button onClick={this.handleCreate}>생성</Button>
    }
};
```

### 3. READ - 1 **(추천)**:

> 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125

```jsx static
import React, { useEffect, useState } from 'react';
import { TreeGrid } from 'owp/components';
import { query } from 'owp/api';

const columns = {
    NAME: '품명',
    CODETYPE1_NM: '규격',
    TOTALCNT: '길이',
    ORDER_MOUNT: '지시 매수(장)',
};

export default const TreeGridWithQuery = props => {
    const [data, setData] = useState();
    useEffect(() => {
        query({
            url: '/listOWP_JobOrder_Panel_LOTNO_Search',
            param: {},
        })
            .then(result => setData(result))
            .catch(error => console.error('error...', error));
    }, []);

    if (!data) {
        return null;
    }

    return <TreeGrid columns={columns} rows={data} />;
};
```

### 4. READ - 2:

> 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125

```jsx static
import React from 'react';
import { TreeGrid } from 'owp/components';
import { query } from 'owp/api';

const columns = {
    NAME: '품명',
    CODETYPE1_NM: '규격',
    TOTALCNT: '길이',
    ORDER_MOUNT: '지시 매수(장)',
};

export default class TreeGridWithQuery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
        };
    }

    componentDidMount() {
        query({
            url: '/listOWP_JobOrder_Panel_LOTNO_Search',
            param: {},
        })
            .then((data) => this.setState({ rows: data }))
            .catch((error) => console.error(error));
    }

    render() {
        if (!this.state.rows) {
            return null;
        }

        return <TreeGrid columns={columns} rows={this.state.rows} />;
    }
}
```

### 5. READ (Multi) - 1 **(추천)**:

> 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125

```jsx static
import React, { useEffect, useState } from 'react';
import { TreeGrid } from 'owp/components';
import { queryAll } from 'owp/api';

const panelColumns = {
    NAME: '품명',
    CODETYPE1_NM: '규격',
    TOTALCNT: '길이',
    ORDER_MOUNT: '지시 매수(장)',
};

const deptColumns = {
    CODEID: 'NO',
    CODENM: '부서명',
    FLAG: '사용여부',
};

export default const TreeGridWithQueryAll = props => {
    const [data, setData] = useState();
    useEffect(() => {
        queryAll([
            {
                url: '/listOWP_JobOrder_Panel_LOTNO_Search',
                param: {},
            },
            {
                url: '/listIPX_CommonCodeDeptAC',
                param: {},
            },
        ])
            .then(result => setData(result))
            .catch(error => console.error('error...', error));
    }, []);

    if (!data) {
        return null;
    }

    const [panelData, deptData] = data;

    return (
        <>
            <TreeGrid id="panel-grid" columns={panelColumns} rows={panelData} />
            <TreeGrid id="dept-grid" columns={deptColumns} rows={deptData} />
        </>
    );
};
```

### 6. READ (Multi) - 2:

> 연관 이슈 : https://github.com/leeinbae/owp/issues/19#issuecomment-462234125

```jsx static
import React from 'react';
import { TreeGrid } from 'owp/components';
import { queryAll } from 'owp/api';

const panelColumns = {
    NAME: '품명',
    CODETYPE1_NM: '규격',
    TOTALCNT: '길이',
    ORDER_MOUNT: '지시 매수(장)',
};

const deptColumns = {
    CODEID: 'NO',
    CODENM: '부서명',
    FLAG: '사용여부',
};

export default class TreeGridWithQueryAll extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: null,
        };
    }

    componentDidMount() {
        queryAll([
            {
                url: '/listOWP_JobOrder_Panel_LOTNO_Search',
                param: {},
            },
            {
                url: '/listIPX_CommonCodeDeptAC',
                param: {},
            },
        ])
            .then((data) => this.setState({ rows: data }))
            .catch((error) => console.error('error...', error));
    }

    render() {
        if (!this.state.rows) {
            return null;
        }

        const [panelData, deptData] = this.state.rows;

        return (
            <>
                <TreeGrid id="panel-grid" columns={panelColumns} rows={panelData} />
                <TreeGrid id="dept-grid" columns={deptColumns} rows={deptData} />
            </>
        );
    }
}
```

### 7. UPDATE:

```jsx static
import { mutate } from 'owp/api';
import { Button } from '@material-ui/core';
import React from 'react';

export default class UpdateSample extends React.Component {
    handleUpdate = async () => {
        try {
            const result = await mutate({
                url: '/updateApi'
                data: {
                    'IPX.Seq': '1',
                    'IPX.name': 'name',
                }
            });

            console.log('result', result);
        } catch(error) {
            console.error('create.error', error);
        }
    };

    render() {
        return <Button onClick={this.handleUpdate}>수정</Button>
    }
};
```

### 8. DELETE:

```jsx static
import { mutate } from 'owp/api';
import { Button } from '@material-ui/core';
import React from 'react';

export default class DeleteSample extends React.Component {
    handleDelete = async () => {
        try {
            const result = await mutate({
                url: '/deleteApi/1',
            });

            console.log('result', result);
        } catch (error) {
            console.error('create.error', error);
        }
    };

    render() {
        return <Button onClick={this.handleDelete}>삭제</Button>;
    }
}
```

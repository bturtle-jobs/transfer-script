import { query } from 'owp/api';
import React from 'react';
import ReactDOM from 'react-dom';

query({
    url: '/aaa',
});

const App = () => (
    <div>
        <h1>sample app</h1>
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

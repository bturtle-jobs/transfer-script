import { withQuery } from 'owp/api/hocs';
import React from 'react';
import PivotTable from './PivotTable';

export default withQuery((data) => ({ data }))((props) => <PivotTable pivotTableOnly {...props} />);

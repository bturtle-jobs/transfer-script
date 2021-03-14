import { withQuery } from 'owp/api/hocs';
import RadioFormGroup from './RadioFormGroup';
import { mapDataToOwpPresetFormProps } from './util';

export default withQuery(mapDataToOwpPresetFormProps())(RadioFormGroup);

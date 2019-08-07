import { combineReducers } from 'redux';

import auth from '../auth/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';

export default combineReducers({
    auth,
    issuesData: issuesReducer
});

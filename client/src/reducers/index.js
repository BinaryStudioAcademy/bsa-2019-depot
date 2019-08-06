import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';

export default combineReducers({
    issuesData: issuesReducer
});

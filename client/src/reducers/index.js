import { combineReducers } from 'redux';
import authReducer from '../sagas/auth/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';

export default combineReducers({
    issuesData: issuesReducer,
    authReducer
});

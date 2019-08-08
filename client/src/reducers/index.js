import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';
import profile from '../containers/Profile/reducer';

export default combineReducers({
    profile,
    issuesData: issuesReducer,
    commitsData,
    branchesData
});

import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import signupReducer from '../scenes/Signup/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';
import authReducer from '../scenes/Login/reducer';

export default combineReducers({
    auth: authReducer,
    signup: signupReducer,
    issuesData: issuesReducer,
    commitsData,
    branchesData
});

import { combineReducers } from 'redux';

import { authReducer as auth } from '../sagas/auth/reducer';
import { profileReducer as profile } from '../sagas/profile/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';

export default combineReducers({
    auth,
    profile,
    forgot,
    issuesData: issuesReducer,
    commitsData,
    branchesData
});

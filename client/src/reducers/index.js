import { combineReducers } from 'redux';

import { authReducer as auth } from '../sagas/auth/reducer';
import { profileReducer as profile } from '../sagas/profile/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';
import signupReducer from '../scenes/Signup/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';

export default combineReducers({
    auth,
    signup: signupReducer,
    profile,
    issuesData: issuesReducer,
    commitsData,
    branchesData,
    repoSettingsData
});

import { combineReducers } from 'redux';

import { authReducer as auth } from '../sagas/auth/reducer';
import { profileReducer as profile } from '../sagas/profile/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';
import { settingsReducer as settings } from '../scenes/SettingsPage/reducer';

export default combineReducers({
    auth,
    profile,
    issuesData: issuesReducer,
    settings
});

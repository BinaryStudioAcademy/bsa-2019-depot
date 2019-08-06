import { combineReducers } from 'redux';

import { authReducer as auth } from '../sagas/auth/reducer';
import { profileReducer as profile } from '../sagas/profile/reducer';

export default combineReducers({
    auth,
    profile
});

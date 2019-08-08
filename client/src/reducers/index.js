import { combineReducers } from 'redux';

import { authReducer as auth } from '../sagas/auth/reducer';
import { profileReducer as profile } from '../sagas/profile/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import issuesReducer from '../containers/IssuesTab/reducer';
import signupReducer from '../scenes/Signup/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';

export default combineReducers({
  auth,
  signup: signupReducer,
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  commitsData,
  branchesData
});

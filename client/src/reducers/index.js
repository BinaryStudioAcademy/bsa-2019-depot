import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';
import profile from '../containers/Profile/reducer';
import { repositoriesReducer } from '../scenes/Dashboard/reducer';
import forkRepo from '../components/ForkButton/reducer';

export default combineReducers({
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  commitsData,
  branchesData,
  repoSettingsData,
  repositories: repositoriesReducer,
  forkRepo
});

import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData, branchesData } from '../containers/CommitsPage/reducer';
import { diffsData } from '../components/DiffCommitView/reducer';
import { lastCommitReducer, fileTreeReducer } from '../scenes/CodeTab/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';
import profile from '../containers/Profile/reducer';
import { repositoriesReducer } from '../scenes/Dashboard/reducer';
import forkRepo from '../components/ForkButton/reducer';
import createOrg from '../scenes/CreateOrganization/reducer';

export default combineReducers({
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  commitsData,
  branchesData,
  diffsData,
  lastCommitData: lastCommitReducer,
  fileTreeData: fileTreeReducer,
  repoSettingsData,
  repositories: repositoriesReducer,
  forkRepo,
  createOrg
});

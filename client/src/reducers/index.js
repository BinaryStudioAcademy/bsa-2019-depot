import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData } from '../containers/CommitsPage/reducer';
import { branchReducer, fileTreeReducer, newFileReducer } from '../scenes/CodeTab/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';
// import { currentRepoReducer } from '../containers/RepositoryTab/reducer';
import profile from '../containers/Profile/reducer';
import { branchesData } from '../containers/BranchesTab/reducer';
import createOrg from '../scenes/CreateOrganization/reducer';
import { currentRepoReducer } from '../scenes/RepositoryPage/reducer';

const currentRepo = combineReducers({
  repository: currentRepoReducer,
  branch: branchReducer,
  fileTreeData: fileTreeReducer
});

export default combineReducers({
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  commitsData,
  branchesData,
  newFile: newFileReducer,
  repoSettingsData,
  currentRepo,
  createOrg
});

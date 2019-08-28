import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData } from '../containers/CommitsPage/reducer';
import { lastCommitReducer, fileTreeReducer, newFileReducer } from '../scenes/CodeTab/reducer';
import { repoSettingsData } from '../containers/RepositoryOptions/reducer';
import { currentRepoReducer } from '../containers/RepositoryTab/reducer';
import profile from '../containers/Profile/reducer';
import { branchesData } from '../containers/BranchesTab/reducer';
import createOrg from '../scenes/CreateOrganization/reducer';

export default combineReducers({
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  commitsData,
  branchesData,
  lastCommitData: lastCommitReducer,
  fileTreeData: fileTreeReducer,
  newFile: newFileReducer,
  repoSettingsData,
  currentRepo: currentRepoReducer,
  createOrg
});

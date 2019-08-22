import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import issueCommentsReducer from '../components/IssueComments/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData } from '../containers/CommitsPage/reducer';
import { lastCommitReducer, fileTreeReducer, newFileReducer } from '../scenes/CodeTab/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';
import { currentRepoReducer } from '../containers/RepositoryTab/reducer';
import profile from '../containers/Profile/reducer';
import forkRepo from '../components/ForkButton/reducer';
import { branchesData } from '../containers/BranchesTab/reducer';
import createOrg from '../scenes/CreateOrganization/reducer';

export default combineReducers({
  profile,
  forgot,
  reset,
  issuesData: issuesReducer,
  issueCommentsData: issueCommentsReducer,
  commitsData,
  branchesData,
  lastCommitData: lastCommitReducer,
  fileTreeData: fileTreeReducer,
  newFile: newFileReducer,
  repoSettingsData,
  currentRepo: currentRepoReducer,
  forkRepo,
  createOrg
});

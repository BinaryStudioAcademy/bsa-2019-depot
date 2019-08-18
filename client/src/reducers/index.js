import { combineReducers } from 'redux';

import issuesReducer from '../containers/IssuesTab/reducer';
import { forgotReducer as forgot } from '../scenes/Forgot/reducer';
import { resetReducer as reset } from '../scenes/Reset/reducer';
import { commitsData } from '../containers/CommitsPage/reducer';
import { diffsData } from '../components/DiffCommitView/reducer';
import { lastCommitReducer, fileTreeReducer } from '../scenes/CodeTab/reducer';
import { repoSettingsData } from '../containers/SettingsTab/reducer';
import { currentRepoIdReducer } from '../containers/RepositoryTab/reducer';
import profile from '../containers/Profile/reducer';
import { userStatsReducer } from '../scenes/Dashboard/reducer';
import forkRepo from '../components/ForkButton/reducer';
import { branchesData } from '../containers/BranchesTab/reducer';

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
  userStats: userStatsReducer,
  currentRepoId: currentRepoIdReducer,
  forkRepo
});

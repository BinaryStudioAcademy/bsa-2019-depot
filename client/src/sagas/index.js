import { all, call } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import commitPageSagas from '../containers/CommitsPage/sagas';
import diffsSagas from '../components/DiffCommitView/sagas';
import codeTabSagas from '../scenes/CodeTab/sagas';
import profileSagas from '../containers/Profile/sagas';
import { watchRepositories } from '../scenes/Dashboard/sagas';
import profileSettingsSagas from '../containers/SettingsProfile/sagas';
import forkRepoSagas from '../components/ForkButton/sagas';
import repoSettingsSagas from '../containers/SettingsTab/sagas';
import branchesSagas from '../containers/BranchesTab/sagas';

export default function* rootSaga() {
  yield all([
    issuesSagas(),
    call(watchForgotPassword),
    watchResetPassword(),
    commitPageSagas(),
    diffsSagas(),
    profileSagas(),
    watchRepositories(),
    codeTabSagas(),
    repoSettingsSagas(),
    profileSettingsSagas(),
    forkRepoSagas(),
    branchesSagas()
  ]);
}

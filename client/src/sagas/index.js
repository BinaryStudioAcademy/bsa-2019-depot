import { all, call } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import commitPageSagas from '../containers/CommitsPage/sagas';
import codeTabSagas from '../scenes/CodeTab/sagas';
import profileSagas from '../containers/Profile/sagas';
import profileSettingsSagas from '../containers/SettingsProfile/sagas';
import repoOptionsSagas from '../containers/RepositoryOptions/sagas';
import branchesSagas from '../containers/BranchesTab/sagas';
import createIssueSagas from '../containers/CreateIssuePage/sagas';
// import repositoryTabSagas from '../containers/RepositoryTab/sagas';
import createOrganizationSagas from '../scenes/CreateOrganization/sagas';
import repositoryPageSagas from '../scenes/RepositoryPage/sagas';

export default function* rootSaga() {
  yield all([
    issuesSagas(),
    call(watchForgotPassword),
    watchResetPassword(),
    commitPageSagas(),
    profileSagas(),
    codeTabSagas(),
    repoOptionsSagas(),
    profileSettingsSagas(),
    branchesSagas(),
    createIssueSagas(),
    // repositoryTabSagas(),
    createOrganizationSagas(),
    repositoryPageSagas()
  ]);
}

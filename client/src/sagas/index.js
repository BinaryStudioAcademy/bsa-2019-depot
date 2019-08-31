import { all, call } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import pullRequestsSagas from '../containers/PullRequestsTab/sagas';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import commitPageSagas from '../containers/CommitsPage/sagas';
import codeTabSagas from '../scenes/CodeTab/sagas';
import profileSagas from '../containers/Profile/sagas';
import profileSettingsSagas from '../containers/SettingsProfile/sagas';
import repoSettingsSagas from '../containers/SettingsTab/sagas';
import branchesSagas from '../containers/BranchesTab/sagas';
import createIssueSagas from '../containers/CreateIssuePage/sagas';
import repositoryTabSagas from '../containers/RepositoryTab/sagas';
import createOrganizationSagas from '../scenes/CreateOrganization/sagas';

export default function* rootSaga() {
  yield all([
    issuesSagas(),
    pullRequestsSagas(),
    call(watchForgotPassword),
    watchResetPassword(),
    commitPageSagas(),
    profileSagas(),
    codeTabSagas(),
    repoSettingsSagas(),
    profileSettingsSagas(),
    branchesSagas(),
    createIssueSagas(),
    repositoryTabSagas(),
    createOrganizationSagas()
  ]);
}

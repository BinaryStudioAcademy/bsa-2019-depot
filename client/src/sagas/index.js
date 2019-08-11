import { call, all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import commitPageSagas from '../containers/CommitsPage/sagas';
import profileSagas from '../containers/Profile/sagas';
import { watchRepositories } from '../scenes/Dashboard/sagas';

import repoSettingsSagas from '../containers/SettingsTab/sagas';
export default function* rootSaga() {
    yield all([
        issuesSagas(),
        call(watchForgotPassword),
        watchResetPassword(),
        commitPageSagas(),
        profileSagas(),
        repoSettingsSagas(),
        watchRepositories()
    ]);
}

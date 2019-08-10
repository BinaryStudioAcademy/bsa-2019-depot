import { all, call } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import commitPageSagas from '../containers/CommitsPage/sagas';
// import signupSagas from '../scenes/Signup/sagas';
// import loginSagas from '../scenes/Login/sagas';
import profileSagas from '../containers/Profile/sagas';

export default function* rootSaga() {
    yield all([
        issuesSagas(),
        call(watchForgotPassword),
        // signupSagas(),
        watchResetPassword(),
        commitPageSagas(),
        // loginSagas(),
        profileSagas()
    ]);
}

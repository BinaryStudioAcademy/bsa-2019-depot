import { call, all } from 'redux-saga/effects';

import { watchAuth } from '../sagas/auth/saga/watchers';
import { watchForgotPassword } from '../scenes/Forgot/saga/watchers';
import { watchResetPassword } from '../scenes/Reset/saga/watchers';
import issuesSagas from '../containers/IssuesTab/sagas';
import commitPageSagas from '../containers/CommitsPage/sagas';
import signupSagas from '../scenes/Signup/sagas';

export default function* rootSaga() {
  yield all([
    call(watchAuth),
    issuesSagas(),
    call(watchForgotPassword),
    watchResetPassword(),
    signupSagas(),
    commitPageSagas()
  ]);
}

import { call, all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import commitPageSagas from '../containers/CommitsPage/sagas';
import signupSagas from '../scenes/Signup/sagas';
import { watchAuth } from '../sagas/auth/saga/watchers';
export default function* rootSaga() {
    yield all([call(watchAuth), issuesSagas(), signupSagas(), commitPageSagas()]);
}

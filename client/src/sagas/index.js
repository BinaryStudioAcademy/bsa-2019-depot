import { call, all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import commitPageSagas from '../containers/CommitsPage/sagas';
import signupSagas from '../scenes/Signup/sagas';
import { watchRepositories } from '../sagas/git/saga/watchers';
import { watchAuth } from '../sagas/auth/saga/watchers';
export default function* rootSaga() {
    yield all([call(watchAuth), issuesSagas(), signupSagas(), commitPageSagas(), call(watchRepositories)]);
}

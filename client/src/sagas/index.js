import { call, all } from 'redux-saga/effects';

import { watchAuth } from '../sagas/auth/saga/watchers';
import issuesSagas from '../containers/IssuesTab/sagas';
import commitsSagas from '../containers/CommitsPage/sagas';
export default function* rootSaga() {
    yield all([call(watchAuth), issuesSagas(), commitsSagas()]);
}

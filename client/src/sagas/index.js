import { call, all } from 'redux-saga/effects';


import { watchAuth } from '../sagas/auth/saga/watchers';
import issuesSagas from '../containers/IssuesTab/sagas';
export default function* rootSaga() {
    yield all([call(watchAuth), issuesSagas()]);

}

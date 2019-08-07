import { all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';

export default function* rootSaga() {
    yield all([issuesSagas()]);
}

import { all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import commitPageSagas from '../containers/CommitsPage/sagas';
import profileSagas from '../containers/Profile/sagas';

export default function* rootSaga() {
    yield all([issuesSagas(), commitPageSagas(), profileSagas()]);
}

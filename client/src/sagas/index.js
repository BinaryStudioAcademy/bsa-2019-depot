import { all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import signupSagas from '../scenes/Signup/sagas';

export default function* rootSaga() {
    yield all([issuesSagas(), signupSagas()]);
}

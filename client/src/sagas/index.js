import { all } from 'redux-saga/effects';

import issuesSagas from '../containers/IssuesTab/sagas';
import commitPageSagas from '../containers/CommitsPage/sagas';
import signupSagas from '../scenes/Signup/sagas';
import loginSagas from '../scenes/Login/sagas';

export default function* rootSaga() {
    yield all([issuesSagas(), signupSagas(), commitPageSagas(), loginSagas()]);
}

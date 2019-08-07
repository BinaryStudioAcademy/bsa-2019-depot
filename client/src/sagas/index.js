import { call, all } from 'redux-saga/effects';

<<<<<<< HEAD
import issuesSagas from '../containers/IssuesTab/sagas';
import signupSagas from '../scenes/Signup/sagas';
=======
>>>>>>> ebeb970b5fc5afc652f16616a05eae4d22833c87

import { watchAuth } from '../sagas/auth/saga/watchers';
import issuesSagas from '../containers/IssuesTab/sagas';
export default function* rootSaga() {
<<<<<<< HEAD
    yield all([issuesSagas(), signupSagas()]);
=======
    yield all([call(watchAuth), issuesSagas()]);

>>>>>>> ebeb970b5fc5afc652f16616a05eae4d22833c87
}

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as signupService from '../../services/signup.service';
import { signupRoutine } from '../../routines/routines';

function* signup({ payload: { user } }) {
    try {
        const response = yield call(signupService.signup, user);
        yield put(signupRoutine.success(response));
    } catch (error) {
        yield put(signupRoutine.failure(error.message));
    } finally {
        yield put(signupRoutine.fulfill());
    }
}

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.REQUEST, signup);
}

export default function* issuesSagas() {
    yield all([watchSignupRequest()]);
}

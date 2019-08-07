import { takeEvery, takeLatest, put, call, all, delay } from 'redux-saga/effects';
import * as signupService from '../../services/signup.service';
import { signupRoutine, googleSignupRoutine } from '../../routines/routines';

function* signup({ payload: { user, history } }) {
    try {
        const response = yield call(signupService.signup, user);
        const { token } = response;
        yield call(signupService.setToken, token);
        yield put(signupRoutine.success(response));
        yield call(history.push, '/');
    } catch (error) {
        yield put(signupRoutine.failure(error.message));
    } finally {
        yield put(signupRoutine.fulfill());
    }
}

function* googleSignup() {
    try {
        debugger;
        yield delay(1000); // check that Loader is working
        const response = yield call(signupService.googleSignup);
        yield put(googleSignupRoutine.success(response));
    } catch (error) {
        yield put(googleSignupRoutine.failure(error.message));
    }
}

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.REQUEST, signup);
}

function* watchGoogleSignupRequest() {
    yield takeLatest(googleSignupRoutine.REQUEST, googleSignup);
}

export default function* issuesSagas() {
    yield all([watchSignupRequest(), watchGoogleSignupRequest()]);
}

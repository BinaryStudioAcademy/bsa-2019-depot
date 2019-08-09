import { takeEvery, takeLatest, put, call, all, delay } from 'redux-saga/effects';
import * as signupService from '../../services/signup.service';

import {
    signupRoutine,
    googleSignupRoutine,
    setUsernameRoutine,
    fillProfileRoutine,
    loginRoutine
} from '../../routines/routines';
// import { authActions } from '../../sagas/auth/actions';

function* signup({ payload: { user: newUser, history } }) {
    try {
        const response = yield call(signupService.signup, newUser);
        const { token, user } = response;
        const profile = {
            id: user.id,
            username: user.username,
            email: user.email,
            token
        };
        yield put(fillProfileRoutine.request({ profile }));
        yield put(loginRoutine.success(response));
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
        yield delay(1000); // check that Loader is working
        const response = yield call(signupService.googleSignup);
        const { jwt } = response;
        yield call(signupService.setToken, jwt);
        yield put(googleSignupRoutine.success(response));
    } catch (error) {
        yield put(googleSignupRoutine.failure(error.message));
    }
}

function* setUsername({ payload: { username, history } }) {
    try {
        const response = yield call(signupService.setUsername, username);
        yield put(setUsernameRoutine.success(response));
    } catch (error) {
        yield put(setUsernameRoutine.failure(error.message));
    } finally {
        yield put(setUsernameRoutine.fulfill());
    }
}

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.REQUEST, signup);
}

function* watchGoogleSignupRequest() {
    yield takeLatest(googleSignupRoutine.REQUEST, googleSignup);
}

function* watchSetUsername() {
    yield takeEvery(setUsernameRoutine.REQUEST, setUsername);
}

export default function* issuesSagas() {
    yield all([watchSignupRequest(), watchGoogleSignupRequest(), watchSetUsername()]);
}

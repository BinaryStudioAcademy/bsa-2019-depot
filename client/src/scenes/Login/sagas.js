import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as authService from '../../services/authService';
import * as signupService from '../../services/signup.service';

import { loginRoutine, fillProfileRoutine, loginGoogleRoutine, setUsernameRoutine } from '../../routines/routines';

function* login({ payload: { username, password, history } }) {
    try {
        const response = yield call(authService.login, { username, password });
        const { token, user } = response;
        yield call(signupService.setToken, token);

        const profile = {
            id: user.id,
            username: user.username,
            email: user.email,
            token,
            usernameExists: true
        };
        yield put(fillProfileRoutine.request({ profile }));
        yield put(loginRoutine.success(response));
        yield call(history.push, '/');
    } catch (error) {
        yield put(loginRoutine.failure(error.message));
    } finally {
        yield put(loginRoutine.fulfill());
    }
}

function* watchLoginRequest() {
    yield takeEvery(loginRoutine.REQUEST, login);
}

function* loginGoogle({ payload: { user, history } }) {
    try {
        const { jwt } = user;
        yield call(signupService.setToken, jwt);
        const profile = {
            id: user.id,
            username: user.username,
            email: user.email,
            jwt,
            usernameExists: user.usernameExists
        };
        yield put(fillProfileRoutine.request({ profile }));
        yield put(loginRoutine.success(user));
        if (user.usernameExists) {
            yield call(history.push, '/');
        }
    } catch (error) {
        console.error(error);
    }
}

function* watchGoogleLogin() {
    yield takeEvery(loginGoogleRoutine.REQUEST, loginGoogle);
}

function* setUsername({ payload: { username, profile, history } }) {
    try {
        const response = yield call(signupService.setUsername, username, profile);
        const { status } = response;
        if (status) {
            yield put(setUsernameRoutine.success(username));
            yield call(history.push, '/');
        }
    } catch (error) {
        yield put(setUsernameRoutine.failure(error.message));
    } finally {
        yield put(setUsernameRoutine.fulfill());
    }
}

function* watchSetUsername() {
    yield takeEvery(setUsernameRoutine.REQUEST, setUsername);
}

export default function* loginSagas() {
    yield all([watchLoginRequest(), watchGoogleLogin(), watchSetUsername()]);
}

import { takeEvery, put, call, all, apply } from 'redux-saga/effects';
import * as authService from '../../services/authService';
import * as signupService from '../../services/signupService';
import {
    authorizeUser,
    fetchCurrentUser,
    signupRoutine,
    loginGoogleRoutine,
    setUsernameRoutine
} from '../../routines/routines';

function* authorizationRequest({ payload }) {
    try {
        yield put(authorizeUser.request());
        const response = yield call(authService.login, payload);
        yield apply(localStorage, localStorage.setItem, ['token', response.token]);
        delete response.user.password;
        yield put(authorizeUser.success(response.user));
    } catch (error) {
        yield put(authorizeUser.failure(error.message));
    } finally {
        yield put(authorizeUser.fulfill());
    }
}

function* watchAuthorizationRequest() {
    yield takeEvery(authorizeUser.TRIGGER, authorizationRequest);
}

function* currentUserRequest() {
    try {
        yield put(fetchCurrentUser.request());

        const response = yield call(authService.getCurrentUser);

        yield put(fetchCurrentUser.success(response));
    } catch (error) {
        yield put(fetchCurrentUser.failure(error.message));
    } finally {
        yield put(fetchCurrentUser.fulfill());
    }
}

function* watchCurrentUserRequest() {
    yield takeEvery(fetchCurrentUser.TRIGGER, currentUserRequest);
}

function* loginGoogle({ payload: { user, history } }) {
    try {
        const { jwt } = user;
        yield call(signupService.setToken, jwt);
        const authorizedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            token: jwt
        };
        yield put(loginGoogleRoutine.success(authorizedUser));
    // if (user.usernameExists) {
    //     yield call(history.push, '/');
    // }
    } catch (error) {
        yield put(loginGoogleRoutine.failure(error.message));
    }
}

function* watchLoginGoogleRequest() {
    yield takeEvery(loginGoogleRoutine.REQUEST, loginGoogle);
}

function* signup({ payload: { user, history } }) {
    try {
        yield put(signupRoutine.request());

        const response = yield call(signupService.signup, user);
        const { token } = response;

        yield call(signupService.setToken, token);
        yield put(signupRoutine.success(response.user));

        yield call(history.push, '/');
    } catch (error) {
        yield put(signupRoutine.failure(error.message));
    } finally {
        yield put(signupRoutine.fulfill());
    }
}

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.TRIGGER, signup);
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

function* watchSetUsernameRequest() {
    yield takeEvery(setUsernameRoutine.REQUEST, setUsername);
}

export default function* profileSagas() {
    yield all([
        watchAuthorizationRequest(),
        watchCurrentUserRequest(),
        watchSignupRequest(),
        watchLoginGoogleRequest(),
        watchSetUsernameRequest()
    ]);
}

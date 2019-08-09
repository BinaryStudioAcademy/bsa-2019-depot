import { takeEvery, put, call, all, apply } from 'redux-saga/effects';
import * as authService from '../../services/authService';
import * as signupService from '../../services/signupService';
import { authorizeUser, fetchCurrentUser, signupRoutine } from '../../routines/routines';

function* authorizationRequest({ payload }) {
    try {
        yield put(authorizeUser.request());

        const response = yield call(authService.login, payload);
        const userData = yield apply(response, response.json);

        if (response.status !== 200) {
            throw new Error(response.message);
        }

        yield apply(localStorage, localStorage.setItem, ['token', userData.token]);
        yield put(authorizeUser.success(userData.user));
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

export default function* profileSagas() {
    yield all([watchAuthorizationRequest(), watchCurrentUserRequest(), watchSignupRequest()]);
}

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as authService from '../../services/authService';
import * as signupService from '../../services/signup.service';

import { loginRoutine, fillProfileRoutine } from '../../routines/routines';

function* login({ payload: { username, password, history } }) {
    try {
        const response = yield call(authService.login, { username, password });
        const { token, user } = response;
        yield call(signupService.setToken, token);

        const profile = {
            id: user.id,
            username: user.username,
            email: user.email,
            token
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

export default function* loginSagas() {
    yield all([watchLoginRequest()]);
}

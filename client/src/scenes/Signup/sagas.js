import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as signupService from '../../services/signup.service';

import { signupRoutine, fillProfileRoutine, loginRoutine } from '../../routines/routines';

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

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.REQUEST, signup);
}

export default function* issuesSagas() {
    yield all([watchSignupRequest()]);
}

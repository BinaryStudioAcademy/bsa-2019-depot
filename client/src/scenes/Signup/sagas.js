import { takeEvery, put, call, all, delay } from 'redux-saga/effects';
import * as signupService from '../../services/signup.service';
import { signupRoutine } from '../../routines/routines';

function* signup({ payload: { user, history } }) {
    try {
        const response = yield call(signupService.signup, user);
        yield delay(1000); // check that Loader is working
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

function* watchSignupRequest() {
    yield takeEvery(signupRoutine.REQUEST, signup);
}

export default function* issuesSagas() {
    yield all([watchSignupRequest()]);
}

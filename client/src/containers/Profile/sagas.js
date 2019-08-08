import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as authService from '../../services/authService';
import { fetchCurrentUser } from '../../routines/routines';

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

export default function* currentUserSagas() {
    yield all([watchCurrentUserRequest()]);
}

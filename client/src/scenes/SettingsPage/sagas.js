import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as userService from '../../services/userService';
import { fetchUser } from '../../routines/routines';

function* userRequest({ payload: { id } }) {
    try {
        yield put(fetchUser.request());

        const response = yield call(userService.getUser, id);

        yield put(fetchUser.success(response));
    } catch (error) {
        yield put(fetchUser.failure(error.message));
    } finally {
        yield put(fetchUser.fulfill());
    }
}

function* watchUserRequest() {
    yield takeEvery(fetchUser.TRIGGER, userRequest);
}

export default function* userSagas() {
    yield all([watchUserRequest()]);
}

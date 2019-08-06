import { AUTHENTICATE_SUCCESS } from './actionTypes';
import { put, takeEvery, all } from 'redux-saga/effects';

export function* processAuthSuccess() {
    yield put({ type: AUTHENTICATE_SUCCESS });
}

export function* watchProcessAuthSuccess() {
    yield takeEvery(AUTHENTICATE_SUCCESS, processAuthSuccess);
}

export default function* authSagas() {
    yield all([watchProcessAuthSuccess()]);
}

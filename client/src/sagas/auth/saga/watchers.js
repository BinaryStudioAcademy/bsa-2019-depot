//Core
import { takeEvery, all, call } from 'redux-saga/effects';

//Types
import { types } from '../types';

//Workers
import { login } from './workers';

function* watchLogin() {
    yield takeEvery(types.LOGIN_ASYNC, login);
}

export function* watchAuth() {
    yield all([call(watchLogin)]);
}

//Core
import { takeEvery, all, call } from 'redux-saga/effects';

//Types
import { types } from '../types';

//Workers
import { forgotPassword } from './workers';

function* watchForgot() {
    yield takeEvery(types.FORGOT_ASYNC, forgotPassword);
}

export function* watchForgotPassword() {
    yield all([call(watchForgot)]);
}

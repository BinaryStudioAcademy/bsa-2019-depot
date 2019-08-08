import { takeEvery, all, call } from 'redux-saga/effects';
import { types } from '../types';
import { forgotPassword } from './workers';

function* watchForgot() {
  yield takeEvery(types.FORGOT_ASYNC, forgotPassword);
}

export function* watchForgotPassword() {
  yield all([call(watchForgot)]);
}

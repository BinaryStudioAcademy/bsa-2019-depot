import { takeEvery, all, call } from 'redux-saga/effects';
import { types } from '../types';
import { resetPassword } from './workers';

function* watchReset() {
  yield takeEvery(types.RESET_ASYNC, resetPassword);
}

export function* watchResetPassword() {
  yield all([call(watchReset)]);
}

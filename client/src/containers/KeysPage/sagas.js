import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as userService from '../../services/userService';
import { fetchSshKeys } from '../../routines/routines';
import { sshKeyAdded, sshKeyDeleted } from './actions';
import { ADD_SSH_KEY, DELETE_SSH_KEY } from './actionTypes';

function* sshKeysRequest() {
  try {
    yield put(fetchSshKeys.request());

    const response = yield call(userService.getKeys);

    yield put(fetchSshKeys.success(response));
  } catch (error) {
    yield put(fetchSshKeys.failure(error.message));
  } finally {
    yield put(fetchSshKeys.fulfill());
  }
}

function* watchSshKeysRequest() {
  yield takeEvery(fetchSshKeys.TRIGGER, sshKeysRequest);
}

function* addSshKey({ payload }) {
  yield put(fetchSshKeys.request());

  yield call(userService.addKey, payload);

  yield put(sshKeyAdded());
}

function* watchSshKeyAdd() {
  yield takeEvery(ADD_SSH_KEY, addSshKey);
}

function* deleteSshKey({ payload: { id } }) {
  yield call(userService.deleteKey, id);

  yield put(sshKeyDeleted());
}

function* watchSshKeyDelete() {
  yield takeEvery(DELETE_SSH_KEY, deleteSshKey);
}

export default function* sshKeysSagas() {
  yield all([watchSshKeysRequest(), watchSshKeyAdd(), watchSshKeyDelete()]);
}

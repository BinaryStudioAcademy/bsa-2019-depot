import { takeEvery, put, all, call } from 'redux-saga/effects';
import * as userService from '../../services/userService';
import { updateUserSettings, uploadUserPhoto, deleteUserPhoto } from '../../routines/routines';
import { fetchCurrentUser } from '../../routines/routines';

function* updateSettings({ payload }) {
  try {
    yield put(updateUserSettings.request());

    const response = yield call(userService.updateSettings, payload);
    if (response.status) {
      yield put(updateUserSettings.success());
      yield put(fetchCurrentUser.trigger());
    } else {
      yield put(fetchCurrentUser.failure(response.error.message));
    }
  } catch (error) {
    yield put(fetchCurrentUser.failure(error.message));
  } finally {
    yield put(updateUserSettings.fulfill());
  }
}

function* watchUpdateUserSettings() {
  yield takeEvery(updateUserSettings.TRIGGER, updateSettings);
}

function* uploadPhoto({ payload }) {
  try {
    yield put(uploadUserPhoto.request());

    const response = yield call(userService.uploadUserPhoto, payload);
    yield put(uploadUserPhoto.success(response));
  } catch (error) {
    yield put(uploadUserPhoto.failure(error.message));
  } finally {
    yield put(uploadUserPhoto.fulfill());
  }
}

function* watchUploadPhoto() {
  yield takeEvery(uploadUserPhoto.TRIGGER, uploadPhoto);
}

function* deletePhoto({ payload }) {
  try {
    yield put(deleteUserPhoto.request());

    const response = yield call(userService.deleteUserPhoto, payload);
    yield put(deleteUserPhoto.success(response));
  } catch (error) {
    yield put(deleteUserPhoto.failure(error.message));
  } finally {
    yield put(deleteUserPhoto.fulfill());
  }
}

function* watchDeletePhoto() {
  yield takeEvery(deleteUserPhoto.TRIGGER, deletePhoto);
}

export default function* profileSettingsSagas() {
  yield all([watchUpdateUserSettings(), watchUploadPhoto(), watchDeletePhoto()]);
}

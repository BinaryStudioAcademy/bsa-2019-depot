import { takeEvery, put, all, call } from 'redux-saga/effects';
import * as userService from '../../services/userService';
import { updateUserSettings } from '../../routines/routines';
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

export default function* profileSettingsSagas() {
  yield all([watchUpdateUserSettings()]);
}

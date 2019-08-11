import { takeEvery, put, all } from 'redux-saga/effects';
// import * as userService from '../../services/userService';
import { updateUserSettings } from '../../routines/routines';

function* updateSettings({ payload: { values } }) {
    try {
        console.warn(values);

        yield put(updateUserSettings.request());

    // const { status } = yield call(userService.updateSettings, [user.id, settings]);
    // if (status) {
    //     yield put(updateUserSettings.success());
    //     yield put(fetchCurrentUser.trigger());
    // }
    } catch (error) {
        yield put(updateUserSettings.failure(error.message));
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

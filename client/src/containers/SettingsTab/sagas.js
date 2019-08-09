import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as repoSettingsService from '../../services/repoSettingsService';

import { fetchRepoSettings } from '../../routines/routines';

//import { postRepoSettings } from '../../routines/routines';

function* settingsRequest({ payload: { owner, name } }) {
    try {
        yield put(fetchRepoSettings.request());

        const response = yield call(repoSettingsService.getSettings, { owner, name });
        yield put(fetchRepoSettings.success(response));
    } catch (error) {
        yield put(fetchRepoSettings.failure(error.message));
    } finally {
        yield put(fetchRepoSettings.fulfill());
    }
}

function* watchSettingsRequest() {
    yield takeEvery(fetchRepoSettings.TRIGGER, settingsRequest);
}

//function* setSettings({ payload: {  owner, repoName, settings } }) {
//try {
//  yield put(postRepoSettings.request());
// const newSettings = settings;
// console.log(settings);
//  const response = yield call(repoSettingsService.setSettings, {owner, repoName, newSettings});
// yield put(fetchRepoSettings.request());
//yield put(postRepoSettings.success(response));
//   yield put(fetchRepoSettings.success(response));
//} catch (error) {
//   yield put(postRepoSettings.failure(error.message));
//} finally {
//    yield put(postRepoSettings.fulfill());
//  }
//}
//function* watchSettingsSet() {
//  yield takeEvery(postRepoSettings.trigger, setSettings);
// yield takeEvery(postRepoSettings.success, settingsRequest);
//}

export function* changePrivacy(action) {
    try {
        const { owner, name } = action.payload;
        yield call(repoSettingsService.changePrivacy, { ...action.payload });
        const response = yield call(repoSettingsService.getSettings, { owner, name });
        yield put(fetchRepoSettings.success(response));
    } catch (error) {
        yield put(fetchRepoSettings.request(error.message));
    }
}

function* watchSetSettings() {
    yield takeEvery('CHANGE_PRIVACY', changePrivacy);
}

export function* renameRepo(action) {
    try {
        const { name, owner } = action.payload;
        yield call(repoSettingsService.renameRepo, { ...action.payload });
        const response = yield call(repoSettingsService.getSettings, { owner, name });
        yield put(fetchRepoSettings.success(response));
    } catch (error) {
        yield put(fetchRepoSettings.request(error.message));
    }
}

function* watchRenameRepo() {
    yield takeEvery('RENAME_REPO', renameRepo);
}

export default function* repoSettingsSagas() {
    yield all([watchSettingsRequest(), watchSetSettings(), watchRenameRepo()]);
}

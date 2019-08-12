import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as repoSettingsService from '../../services/repoSettingsService';
import * as types from './types';
import { fetchRepoSettings } from '../../routines/routines';

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
  yield takeEvery(types.RENAME_REPO, renameRepo);
}

export function* deleteRepo(action) {
  try {
    const { name, owner } = action.payload;
    yield call(repoSettingsService.deleteRepo, { ...action.payload });
    const response = yield call(repoSettingsService.getSettings, { owner, name });
    yield put(fetchRepoSettings.success(response));
  } catch (error) {
    yield put(fetchRepoSettings.request(error.message));
  }
}

function* watchDeleteRepo() {
  yield takeEvery(types.DELETE_REPO, deleteRepo);
}

export default function* repoSettingsSagas() {
  yield all([watchSettingsRequest(), watchRenameRepo(), watchDeleteRepo()]);
}

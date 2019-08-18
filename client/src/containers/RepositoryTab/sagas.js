import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as repositoryService from '../../services/repositoryService';
import { fetchCurrentRepoId } from '../../routines/routines';

function* currentRepoIdRequest({ payload }) {
  try {
    yield put(fetchCurrentRepoId.request());

    const response = yield call(repositoryService.getCurrentRepoId, payload);

    yield put(fetchCurrentRepoId.success(response));
  } catch (error) {
    yield put(fetchCurrentRepoId.failure(error.message));
  } finally {
    yield put(fetchCurrentRepoId.fulfill());
  }
}

function* watchCurrentRepoIdRequest() {
  yield takeEvery(fetchCurrentRepoId.TRIGGER, currentRepoIdRequest);
}

export default function* repositoryTabSagas() {
  yield all([watchCurrentRepoIdRequest()]);
}

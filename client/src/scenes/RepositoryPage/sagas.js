import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as repositoryService from '../../services/repositoryService';
import { fetchCurrentRepo, fetchIssues } from '../../routines/routines';

function* currentRepoRequest({ payload }) {
  try {
    yield put(fetchCurrentRepo.request());

    const response = yield call(repositoryService.getRepositoryByOwnerAndName, payload);
    const { id: repositoryId } = response;

    if (repositoryId) {
      yield put(fetchCurrentRepo.success(response));
      yield put(fetchIssues.trigger({ repositoryId, filter: '' }));
    } else {
      yield put(fetchCurrentRepo.failure(response.error.message));
    }
  } catch (error) {
    yield put(fetchCurrentRepo.failure(error.message));
  } finally {
    yield put(fetchCurrentRepo.fulfill());
  }
}

function* watchCurrentRepoRequest() {
  yield takeEvery(fetchCurrentRepo.TRIGGER, currentRepoRequest);
}

export default function* repositoryPageSagas() {
  yield all([watchCurrentRepoRequest()]);
}

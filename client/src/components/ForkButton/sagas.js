import { takeEvery, put, all, call } from 'redux-saga/effects';
import * as repoServise from '../../services/repositoryService';
import { forkRepo } from '../../routines/routines';

function* forkRepoRoutine({ payload }) {
  try {
    yield put(forkRepo.request());
    const response = yield call(repoServise.forkRepo, payload);
    if (response.status) {
      yield put(forkRepo.success(response.path));
    } else {
      yield put(forkRepo.failure(response.error));
    }
  } catch (error) {
    yield put(forkRepo.failure(error.message));
  } finally {
    yield put(forkRepo.fulfill());
  }
}

function* watchForkRepoRoutine() {
  yield takeEvery(forkRepo.TRIGGER, forkRepoRoutine);
}

export default function* forkRepoSagas() {
  yield all([watchForkRepoRoutine()]);
}
import { takeEvery, put, all, call, select } from 'redux-saga/effects';
import * as repoService from '../../services/repositoryService';
import { forkRepo } from '../../routines/routines';

function* forkRepoRoutine({ payload: { owner, repo } }) {
  try {
    // const repoData = yield call(repoService.getRepositoryByOwnerAndName, { username: owner, reponame: repo });
    const { currentRepo: { currentRepoInfo } } = yield select();
    yield put(forkRepo.request());
    const response = yield call(repoService.forkRepo, { owner, repoData: currentRepoInfo });
    if (response.status) {
      yield put(forkRepo.success(response.username));
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

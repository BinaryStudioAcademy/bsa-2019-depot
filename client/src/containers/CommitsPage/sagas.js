import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as commitsService from '../../services/commitsService';
import { fetchCommits } from '../../routines/routines';

function* commitsRequest({ payload: { repoId, branch } }) {
  try {
    yield put(fetchCommits.request());
    const response = yield call(commitsService.getCommits, repoId, branch);
    yield put(fetchCommits.success(response));
  } catch (error) {
    yield put(fetchCommits.failure(error.message));
  } finally {
    yield put(fetchCommits.fulfill());
  }
}

function* watchCommitsRequest() {
  yield takeEvery(fetchCommits.TRIGGER, commitsRequest);
}

export default function* commitPageSagas() {
  yield all([watchCommitsRequest()]);
}

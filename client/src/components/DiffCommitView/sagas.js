import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as commitsService from '../../services/commitsService';
import { fetchDiffs } from '../../routines/routines';

function* diffsRequest({ payload: { owner, repoName, hash } }) {
  try {
    yield put(fetchDiffs.request());

    const response = yield call(commitsService.getCommitDiffs, owner, repoName, hash);
    yield put(fetchDiffs.success(response));
  } catch (error) {
    yield put(fetchDiffs.failure(error.message));
  } finally {
    yield put(fetchDiffs.fulfill());
  }
}

function* watchDiffsRequest() {
  yield takeEvery(fetchDiffs.TRIGGER, diffsRequest);
}

export default function* diffsSagas() {
  yield all([watchDiffsRequest()]);
}

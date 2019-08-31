import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as pullRequestsService from '../../services/pullRequestsService';
import { fetchPullRequests } from '../../routines/routines';

function* pullsRequest({ payload }) {
  try {
    yield put(fetchPullRequests.request());
    const response = yield call(pullRequestsService.getPulls, payload);

    yield put(fetchPullRequests.success(response));
  } catch (error) {
    yield put(fetchPullRequests.failure(error.message));
  } finally {
    yield put(fetchPullRequests.fulfill());
  }
}

function* watchPrRequest() {
  yield takeEvery(fetchPullRequests.TRIGGER, pullsRequest);
}

export default function* pullRequestsSagas() {
  yield all([watchPrRequest()]);
}

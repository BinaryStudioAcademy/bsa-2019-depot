import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as issuesService from '../../services/issuesService';
import { fetchIssues } from '../../routines/routines';

function* issuesRequest({ payload }) {
  try {
    yield put(fetchIssues.request());

    const response = yield call(issuesService.getIssues, payload);

    yield put(fetchIssues.success(response));
  } catch (error) {
    yield put(fetchIssues.failure(error.message));
  } finally {
    yield put(fetchIssues.fulfill());
  }
}

function* watchIssuesRequest() {
  yield takeEvery(fetchIssues.TRIGGER, issuesRequest);
}

export default function* issuesSagas() {
  yield all([watchIssuesRequest()]);
}

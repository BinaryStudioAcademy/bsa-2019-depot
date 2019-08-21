import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as issuesService from '../../services/issuesService';
import { createIssue, fetchIssues } from '../../routines/routines';

function* createIssueRequest({ payload }) {
  try {
    yield put(createIssue.request());

    const response = yield call(issuesService.createIssue, payload);
    if (response.status) {
      const { repositoryId } = payload;
      yield put(createIssue.success());
      yield put(fetchIssues.trigger({ repositoryId, filter: '' }));
    } else {
      yield put(createIssue.failure(response.error.message));
    }
  } catch (error) {
    yield put(createIssue.failure(error.message));
  } finally {
    yield put(createIssue.fulfill());
  }
}

function* watchCreateIssueRequest() {
  yield takeEvery(createIssue.TRIGGER, createIssueRequest);
}

export default function* createIssueSagas() {
  yield all([watchCreateIssueRequest()]);
}

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as issuesService from '../../services/issuesService';
import { fetchIssueComments } from '../../routines/routines';

function* issueCommentsRequest({ payload }) {
  try {
    yield put(fetchIssueComments.request());

    const response = yield call(issuesService.getIssueComments, payload);

    yield put(fetchIssueComments.success(response));
  } catch (error) {
    yield put(fetchIssueComments.failure(error.message));
  } finally {
    yield put(fetchIssueComments.fulfill());
  }
}

function* watchIssueCommentsRequest() {
  yield takeEvery(fetchIssueComments.TRIGGER, issueCommentsRequest);
}

export default function* issueCommentsSagas() {
  yield all([watchIssueCommentsRequest()]);
}

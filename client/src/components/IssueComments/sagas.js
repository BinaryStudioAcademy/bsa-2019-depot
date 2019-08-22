import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as issuesService from '../../services/issuesService';
import { fetchIssueComments, createIssueComment } from '../../routines/routines';

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

function* createIssueCommentRequest({ payload }) {
  try {
    yield put(createIssueComment.request());

    const response = yield call(issuesService.postIssueComment, payload);

    if (response.status) {
      const { username, reponame, issueNumber } = payload;
      yield put(createIssueComment.success());
      yield put(fetchIssueComments.trigger({ username, reponame, issueNumber }));
    } else {
      yield put(createIssueComment.failure(response.error.message));
    }
  } catch (error) {
    yield put(createIssueComment.failure(error.message));
  } finally {
    yield put(createIssueComment.fulfill());
  }
}

function* watchCreateIssueCommentRequest() {
  yield takeEvery(createIssueComment.TRIGGER, createIssueCommentRequest);
}

export default function* issueCommentsSagas() {
  yield all([watchIssueCommentsRequest(), watchCreateIssueCommentRequest()]);
}

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as issuesService from '../../services/issuesService';
import * as repoService from '../../services/repositoryService';
import { createIssue, fetchCurrentRepo } from '../../routines/routines';
import { setLabelsToIssue } from '../../services/labelsService';

function* createIssueRequest({ payload }) {
  try {
    yield put(createIssue.request());
    const { userId, repositoryId, title, body, labelIds, assigneeNames, username, owner, reponame } = payload;
    const response = yield call(issuesService.createIssue, { userId, repositoryId, title, body, username });
    const repoResponse = yield call(repoService.getRepositoryByOwnerAndName, { username: owner, reponame });
    if (response && response.data) {
      const { id: newIssueId } = response.data;
      if (labelIds) {
        yield call(setLabelsToIssue, labelIds, newIssueId);
      }
      if (assigneeNames) {
        yield call(issuesService.setAssigneesToIssue, assigneeNames, newIssueId);
      }
      yield put(createIssue.success());
      yield put(fetchCurrentRepo.success(repoResponse));
    } else {
      yield put(createIssue.failure(response.error.message));
    }
  } catch (error) {
    yield put(createIssue.failure(error.message));
  } finally {
    yield put(createIssue.fulfill());
    const { history, newUrl } = payload;
    history.push(newUrl);
  }
}

function* watchCreateIssueRequest() {
  yield takeEvery(createIssue.TRIGGER, createIssueRequest);
}

export default function* createIssueSagas() {
  yield all([watchCreateIssueRequest()]);
}

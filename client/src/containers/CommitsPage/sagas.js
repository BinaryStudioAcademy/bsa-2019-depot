import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as commitsService from '../../services/commitsService';
import * as branchesService from '../../services/branchesService';
import { fetchCommits, fetchBranches } from '../../routines/routines';

function* commitsRequest({ payload: { username: owner, reponame: repoName, branch } }) {
  try {
    yield put(fetchCommits.request());

    const response = yield call(commitsService.getCommits, owner, repoName, branch);

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

function* branchesRequest({ payload: { username: owner, reponame: repoName } }) {
  try {
    yield put(fetchBranches.request());

    const response = yield call(branchesService.getBranches, owner, repoName);

    yield put(fetchBranches.success(response));
  } catch (error) {
    yield put(fetchBranches.failure(error.message));
  } finally {
    yield put(fetchBranches.fulfill());
  }
}

function* watchBranchesRequest() {
  yield takeEvery(fetchBranches.TRIGGER, branchesRequest);
}

export default function* commitPageSagas() {
  yield all([watchCommitsRequest(), watchBranchesRequest()]);
}

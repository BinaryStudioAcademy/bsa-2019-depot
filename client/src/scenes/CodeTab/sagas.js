import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import * as commitsService from '../../services/commitsService';
import { fetchLastCommitOnBranch, fetchFileTree, fetchCommitCount } from '../../routines/routines';

function* lastCommitRequest({ payload: { username, reponame, branch } }) {
  try {
    yield put(fetchLastCommitOnBranch.request());

    const response = yield call(branchesService.getLastCommit, username, reponame, branch);

    yield put(fetchLastCommitOnBranch.success(response));
  } catch (error) {
    yield put(fetchLastCommitOnBranch.failure(error.message));
  } finally {
    yield put(fetchLastCommitOnBranch.fulfill());
  }
}

function* watchLastCommitRequest() {
  yield takeEvery(fetchLastCommitOnBranch.TRIGGER, lastCommitRequest);
}

function* fileTreeRequest({ payload: { username, reponame, branch, query } }) {
  try {
    yield put(fetchFileTree.request());

    const response = yield call(branchesService.getFileTree, username, reponame, branch, query);

    yield put(fetchFileTree.success(response));
  } catch (error) {
    yield put(fetchFileTree.failure(error.message));
  } finally {
    yield put(fetchFileTree.fulfill());
  }
}

function* watchFileTreeRequest() {
  yield takeEvery(fetchFileTree.TRIGGER, fileTreeRequest);
}

function* commitCountRequest({ payload: { username, reponame, branch } }) {
  try {
    yield put(fetchCommitCount.request());

    const response = yield call(commitsService.getCommitCount, username, reponame, branch);

    yield put(fetchCommitCount.success(response));
  } catch (error) {
    yield put(fetchCommitCount.failure(error.message));
  } finally {
    yield put(fetchCommitCount.fulfill());
  }
}

function* watchCommitCountRequest() {
  yield takeEvery(fetchCommitCount.TRIGGER, commitCountRequest);
}

export default function* codeTabSagas() {
  yield all([watchLastCommitRequest(), watchFileTreeRequest(), watchCommitCountRequest()]);
}

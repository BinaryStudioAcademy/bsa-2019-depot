import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchLastCommitOnBranch, fetchFileTree } from '../../routines/routines';
import { fetchBranch } from '../../routines/routines';

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

function* branchRequest({ payload: { repoId, branch } }) {
  try {
    yield put(fetchBranch.request());
    const response = yield call(branchesService.getBranch, repoId, branch);
    yield put(fetchBranch.success(response));
  } catch (error) {
    yield put(fetchFileTree.failure(error.message));
  }
}

function* watchBranchRequest() {
  yield takeEvery(fetchBranch.TRIGGER, branchRequest);
}

export default function* codeTabSagas() {
  yield all([watchLastCommitRequest(), watchFileTreeRequest(), watchBranchRequest()]);
}

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchLastCommitOnBranch, fetchFileTree } from '../../routines/routines';

function* lastCommitRequest({ payload: { owner, repoName, branch } }) {
  try {
    yield put(fetchLastCommitOnBranch.request());

    const response = yield call(branchesService.getLastCommit, owner, repoName, branch);

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

function* fileTreeRequest({ payload: { owner, repoName, branch, query } }) {
  try {
    yield put(fetchFileTree.request());

    const response = yield call(branchesService.getFileTree, owner, repoName, branch, query);

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

export default function* codeTabSagas() {
  yield all([watchLastCommitRequest(), watchFileTreeRequest()]);
}

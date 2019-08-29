import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchBranch, fetchFileTree } from '../../routines/routines';

function* branchRequest({ payload: { repoID, branch } }) {
  try {
    yield put(fetchBranch.request());
    const response = yield call(branchesService.getBranch, repoID, branch);
    yield put(fetchBranch.success(response));
  } catch (error) {
    yield put(fetchBranch.failure(error.message));
  } finally {
    yield put(fetchBranch.fulfill());
  }
}

function* watchBranchRequest() {
  yield takeEvery(fetchBranch.TRIGGER, branchRequest);
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

export default function* codeTabSagas() {
  yield all([watchBranchRequest(), watchFileTreeRequest()]);
}

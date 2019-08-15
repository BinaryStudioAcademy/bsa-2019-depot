import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchBranches } from '../../routines/routines';

function* branchesRequest({ payload: { owner, repoName, filter } }) {
  try {
    yield put(fetchBranches.request());
    const response = yield call(branchesService.getBranches, owner, repoName, filter);
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

export default function* branchesSagas() {
  yield all([watchBranchesRequest()]);
}

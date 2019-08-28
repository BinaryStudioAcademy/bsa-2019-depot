import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchBranch } from '../../routines/routines';

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

export default function* codeTabSagas() {
  yield all([watchBranchRequest()]);
}

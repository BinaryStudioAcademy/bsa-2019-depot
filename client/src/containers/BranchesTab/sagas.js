import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchBranches } from '../../routines/routines';

function* branchesRequest({ payload: { repoID } }) {
  try {
    yield put(fetchBranches.request());
    const branches = yield call(branchesService.getBranches, repoID);

    yield put(fetchBranches.success({ branches }));
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

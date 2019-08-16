import { takeEvery, put, call, all, delay } from 'redux-saga/effects';
import * as branchesService from '../../services/branchesService';
import { fetchBranches } from '../../routines/routines';

function* branchesRequest({ payload: { owner, repoName } }) {
  try {
    yield put(fetchBranches.request());
    yield delay(1000);
    const branches = yield call(branchesService.getBranches, owner, repoName);
    let lastCommits = {};
    let lastCommitList = [];
    if (branches && branches.length) {
      lastCommitList = yield all(branches.map(branch => call(branchesService.getLastCommit, owner, repoName, branch)));
    }
    lastCommitList.forEach((commit, idx) => (lastCommits[branches[idx]] = lastCommitList[idx]));

    yield put(fetchBranches.success({ branches, lastCommits }));
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

import { takeEvery, put, call, all } from 'redux-saga/effects';
import * as commitsService from '../../services/commitsService';
import * as branchesService from '../../services/branchesService';
import { fetchCommits, fetchBranches } from '../../routines/routines';

function* commitsRequest({ payload: { repoName } }) {
    try {
        yield put(fetchCommits.request());

        const response = yield call(commitsService.getCommits, repoName);

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

function* branchesRequest() {
    try {
        yield put(fetchBranches.request());

        const response = yield call(branchesService.getBranches);

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

export default function* commitsSagas() {
    yield all([watchCommitsRequest(), watchBranchesRequest()]);
}

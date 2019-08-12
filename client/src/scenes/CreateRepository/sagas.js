import { takeEvery, takeLatest, put, call, all } from 'redux-saga/effects';
import { createRepository, checkRepoName } from '../../routines/routines';
import * as repositoryService from '../../services/repositoryService';

function* createRepositoryRequest({ payload }) {
    try {
        yield put(createRepository.request());
        const response = yield call(repositoryService.createRepository, payload);
        yield put(createRepository.success(response));
    } catch (error) {
        yield put(createRepository.failure(error.message));
    } finally {
        yield put(createRepository.fulfill());
    }
}

function* watchCreateRepositoryRequest() {
    yield takeEvery(createRepository.TRIGGER, createRepositoryRequest);
}

function* checkRepoNameRequest({ payload }) {
    try {
        yield put(checkRepoName.request());
        const response = yield call(repositoryService.checkName, payload);
        yield put(checkRepoName.success(response));
    } catch (error) {
        yield put(checkRepoName.failure(error.message));
    } finally {
        yield put(checkRepoName.fulfill());
    }
}

function* watchCheckRepoNameRequest() {
    yield takeLatest(checkRepoName.TRIGGER, checkRepoNameRequest);
}

export default function* createRepositorySagas() {
    yield all([watchCreateRepositoryRequest(), watchCheckRepoNameRequest()]);
}

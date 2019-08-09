//Core
import { takeEvery, all, call } from 'redux-saga/effects';

//Types
import { types } from '../types';

//Workers
import { fetchRepositories } from './workers';

function* watchFetchRepositories() {
    yield takeEvery(types.FETCH_REPOSITORIES, fetchRepositories);
}

export function* watchRepositories() {
    yield all([call(watchFetchRepositories)]);
}

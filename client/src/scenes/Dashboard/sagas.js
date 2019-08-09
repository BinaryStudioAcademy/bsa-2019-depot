// Core
import { takeEvery, all, call, put, apply /*select*/ } from 'redux-saga/effects';

// Types
import { types } from './types';

// Instruments
import { repositoryActions } from './actions';
import * as repositoryService from '../../services/repositoryService';

function* fetchRepositories({ payload: filter }) {
    try {
    // mock data
        const username = 'user_1';
        // replace it with next string
        // const username = yield select(({ profile }) => profile.currentUser.username);
        const repositories = yield apply(repositoryService, repositoryService.getRepositories, [username, filter]);
        yield put(repositoryActions.fillRepositories(repositories));
    } catch (error) {
        throw new Error(error + ' repository worker');
    }
}

function* watchFetchRepositories() {
    yield takeEvery(types.FETCH_REPOSITORIES, fetchRepositories);
}

export function* watchRepositories() {
    yield all([call(watchFetchRepositories)]);
}

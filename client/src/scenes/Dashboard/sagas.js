// Core
import { takeEvery, all, call, put, apply, select } from 'redux-saga/effects';

// Types
import { types } from './types';

// Instruments
import { repositoryActions } from './actions';
import * as repositoryService from '../../services/repositoryService';
import * as commitsService from '../../services/commitsService';

function* fetchRepositories({ payload: filter }) {
  try {
    const username = yield select(({ profile }) => profile.currentUser.username);
    const repositories = yield apply(repositoryService, repositoryService.getRepositories, [username, filter]);
    yield put(repositoryActions.fillRepositories(repositories));
  } catch (error) {
    throw new Error(error + ' repository worker');
  }
}

function* watchFetchRepositories() {
  yield takeEvery(types.FETCH_REPOSITORIES, fetchRepositories);
}

function* fetchActivity() {
  try {
    const username = yield select(({ profile }) => profile.currentUser.username);
    const { monthActivity, userActivitybyDate } = yield apply(repositoryService, commitsService.getAllUserCommits, [
      username
    ]);
    yield put(repositoryActions.fillMonthCommitsActivity(monthActivity));
    yield put(repositoryActions.fillActivityByDate(userActivitybyDate));
  } catch (error) {
    throw new Error(error + ' repository worker');
  }
}

function* watchFetchActivity() {
  yield takeEvery(types.FETCH_ACTIVITY, fetchActivity);
}

export function* watchRepositories() {
  yield all([call(watchFetchRepositories), call(watchFetchActivity)]);
}

//Core
import { put, apply, select } from 'redux-saga/effects';

// Instruments
import { repositoryActions } from '../../actions';
import * as repositoryService from '../../../../services/repositoryService';

export function* fetchRepositories() {
    try {
        const username = yield select(({ profile }) => profile.get('username'));
        const repositories = yield apply(repositoryService, repositoryService.getRepositories, [username]);
        yield put(repositoryActions.fillRepositories(repositories));
    } catch (error) {
        throw new Error(error + ' repository worker');
    }
}

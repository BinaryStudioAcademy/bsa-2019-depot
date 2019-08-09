//Types
import { types } from './types';

export const repositoryActions = {
    // Sync
    fillRepositories: repositories => ({
        type: types.FILL_REPOSITORIES,
        payload: repositories
    }),
    // Async
    fetchRepositories: () => ({
        type: types.FETCH_REPOSITORIES
    })
};

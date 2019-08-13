//Types
import { types } from './types';

export const repositoryActions = {
  // Sync
  fillRepositories: repositories => ({
    type: types.FILL_REPOSITORIES,
    payload: repositories
  }),
  // Async
  fetchRepositories: filter => ({
    type: types.FETCH_REPOSITORIES,
    payload: filter
  })
};

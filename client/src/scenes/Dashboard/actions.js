//Types
import { types } from './types';

export const repositoryActions = {
  // Sync
  fillRepositories: repositories => ({
    type: types.FILL_REPOSITORIES,
    payload: repositories
  }),
  fillMonthCommitsActivity: userActivity => ({
    type: types.FILL_MONTH_COMMITS_ACTIVITY,
    payload: userActivity
  }),
  fillActivityByDate: userActivity => ({
    type: types.FILL_ACTIVITY_BY_DATE,
    payload: userActivity
  }),

  // Async
  fetchRepositories: filter => ({
    type: types.FETCH_REPOSITORIES,
    payload: filter
  }),
  fetchActivity: () => ({
    type: types.FETCH_ACTIVITY
  }),
  setStar: repositoryId => ({
    type: types.SET_STAR,
    payload: repositoryId
  })
};

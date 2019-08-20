//Types
import { types } from './types';

const initialState = {
  userActivityByDate: {},
  monthCommitsActivity: {},
  repositories: []
};

export const userStatsReducer = (state = initialState, action) => {
  switch (action.type) {
  case types.FILL_REPOSITORIES:
    return {
      ...state,
      repositories: [...action.payload]
    };
  case types.FILL_MONTH_COMMITS_ACTIVITY:
    return {
      ...state,
      monthCommitsActivity: { ...action.payload }
    };
  case types.FILL_ACTIVITY_BY_DATE:
    return {
      ...state,
      userActivityByDate: { ...action.payload }
    };
  default:
    return state;
  }
};

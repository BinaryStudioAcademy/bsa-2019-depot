import { fetchBranches } from '../../routines/routines';

const initialState = {
  branches: [],
  lastCommits: {},
  loading: false,
  error: null
};

export const branchesData = (state = initialState, action) => {
  switch (action.type) {
  case fetchBranches.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchBranches.SUCCESS:
    const { branches, lastCommits, error } = action.payload;
    return {
      ...state,
      branches,
      lastCommits
    };
  case fetchBranches.FAILURE:
    return {
      ...state,
      error
    };
  case fetchBranches.FULFILL:
    return {
      ...state,
      loading: false
    };

  default:
    return state;
  }
};
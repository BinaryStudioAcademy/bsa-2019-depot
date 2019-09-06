import { fetchBranches } from '../../routines/routines';

const initialState = {
  branches: [],
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
    const { branches } = action.payload;
    return {
      ...state,
      branches
    };
  case fetchBranches.FAILURE:
    return {
      ...state,
      error: action.payload
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

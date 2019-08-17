import { fetchCommits } from '../../routines/routines';

const initialState = {
  commits: [],
  loading: false,
  error: null
};

export const commitsData = (state = initialState, action) => {
  switch (action.type) {
  case fetchCommits.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchCommits.SUCCESS:
    return {
      ...state,
      commits: action.payload
    };
  case fetchCommits.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchCommits.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

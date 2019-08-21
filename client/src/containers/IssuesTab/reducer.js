import { fetchIssues } from '../../routines/routines';

const initialState = {
  issues: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case fetchIssues.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchIssues.SUCCESS:
    return {
      ...state,
      issues: action.payload
    };
  case fetchIssues.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchIssues.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

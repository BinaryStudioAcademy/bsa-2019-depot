import { fetchPullRequests } from '../../routines/routines';

const initialState = {
  pulls: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case fetchPullRequests.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchPullRequests.SUCCESS:
    return {
      ...state,
      pulls: action.payload
    };
  case fetchPullRequests.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchPullRequests.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

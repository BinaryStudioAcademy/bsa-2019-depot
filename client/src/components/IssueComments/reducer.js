import { fetchIssueComments } from '../../routines/routines';

const initialState = {
  issueComments: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case fetchIssueComments.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchIssueComments.SUCCESS:
    return {
      ...state,
      issueComments: action.payload
    };
  case fetchIssueComments.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchIssueComments.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

import { fetchCurrentRepoId } from '../../routines/routines';

const initialCurrentRepoIdState = {
  currentRepoInfo: {},
  loading: false,
  error: null
};

export const currentRepoReducer = (state = initialCurrentRepoIdState, action) => {
  switch (action.type) {
  case fetchCurrentRepoId.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchCurrentRepoId.SUCCESS:
    return {
      ...state,
      currentRepoInfo: {
        repoId: action.payload.id,
        repoName: action.payload.name
      }
    };
  case fetchCurrentRepoId.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchCurrentRepoId.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

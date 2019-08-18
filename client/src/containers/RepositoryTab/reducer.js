import { fetchCurrentRepoId } from '../../routines/routines';

const initialCurrentRepoIdState = {
  currentRepoId: '',
  loading: false,
  error: null
};

export const currentRepoIdReducer = (state = initialCurrentRepoIdState, action) => {
  switch (action.type) {
  case fetchCurrentRepoId.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchCurrentRepoId.SUCCESS:
    return {
      ...state,
      currentRepoId: action.payload.id
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

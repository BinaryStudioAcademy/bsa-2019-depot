import { fetchCurrentRepo } from '../../routines/routines';

const initialCurrentRepoState = {
  currentRepoInfo: {
    originalRepo: {
      name: '',
      user: {
        username: ''
      }
    }
  },
  loading: false,
  error: null
};

export const currentRepoReducer = (state = initialCurrentRepoState, action) => {
  switch (action.type) {
  case fetchCurrentRepo.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchCurrentRepo.SUCCESS:
    return {
      ...state,
      currentRepoInfo: {
        ...action.payload
      }
    };
  case fetchCurrentRepo.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchCurrentRepo.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

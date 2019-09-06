import { fetchCurrentRepo } from '../../routines/routines';
import { CLEAR_REPO_STATE } from './actionTypes';

const initialCurrentRepoState = {
  currentRepoInfo: {
    id: '',
    name: '',
    owner: {
      id: '',
      username: ''
    },
    description: '',
    website: '',
    createdAt: '',
    updatedAt: '',
    starsCount: null,
    forksCount: null,
    issuesCount: null,
    branches: [],
    defaultBranch: 'master',
    originalRepo: {
      id: '',
      name: '',
      owner: ''
    }
  },
  loading: true,
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
  case CLEAR_REPO_STATE:
    return initialCurrentRepoState;
  default:
    return state;
  }
};

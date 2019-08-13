import { forkRepo } from '../../routines/routines';
import { actionTypes } from './actionTypes';

const initialState = {
  path: null,
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case forkRepo.TRIGGER:
    return { ...state, path: null, loading: true, error: null };
  case forkRepo.SUCCESS:
    return { ...state, path: action.payload };
  case forkRepo.FAILURE:
    return { ...state, error: action.payload };
  case forkRepo.FULFILL:
    return { ...state, loading: false };
  case actionTypes.FORK_REPO_RESET_MODAL:
    return { ...state, path: null, error: null };
  default:
    return state;
  }
};

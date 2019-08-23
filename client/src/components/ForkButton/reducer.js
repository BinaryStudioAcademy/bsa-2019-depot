import { forkRepo } from '../../routines/routines';
import { actionTypes } from './actionTypes';

const initialState = {
  username: null,
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case forkRepo.TRIGGER:
    return { ...state, username: null, loading: true, error: null };
  case forkRepo.SUCCESS:
    return { ...state, username: action.payload };
  case forkRepo.FAILURE:
    return { ...state, error: action.payload };
  case forkRepo.FULFILL:
    return { ...state, loading: false };
  case actionTypes.FORK_REPO_RESET_MODAL:
    return { ...state, username: null, error: null };
  default:
    return state;
  }
};

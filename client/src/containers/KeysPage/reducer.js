import { fetchSshKeys } from '../../routines/routines';
import { ADD_SSH_KEY, SSH_KEY_ADDED } from './actionTypes';

const initialState = {
  sshKeys: [],
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
  case fetchSshKeys.TRIGGER:
  case ADD_SSH_KEY:
    return {
      ...state,
      loading: true
    };
  case fetchSshKeys.SUCCESS:
    return {
      ...state,
      sshKeys: action.payload
    };
  case fetchSshKeys.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchSshKeys.FULFILL:
  case SSH_KEY_ADDED:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

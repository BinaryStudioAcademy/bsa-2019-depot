import { types } from './types';

const initialState = {
  passwordReset: false,
  passwordNotReset: false,
  message: ''
};

export const resetReducer = (state = initialState, action) => {
  switch (action.type) {
  case types.PASSWORD_RESET:
    return { ...state, passwordReset: true, message: action.payload };
  case types.PASSWORD_NOT_RESET:
    return { ...state, passwordNotReset: true, message: action.payload };
  default:
    return state;
  }
};

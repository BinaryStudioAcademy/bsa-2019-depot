import { types } from './types';

export const resetActions = {
  passwordReset: message => {
    return {
      type: types.PASSWORD_RESET,
      payload: message
    };
  },
  passwordNotReset: message => {
    return {
      type: types.PASSWORD_NOT_RESET,
      payload: message
    };
  },
  //Async
  resetAsync: data => {
    return {
      type: types.RESET_ASYNC,
      payload: data
    };
  }
};

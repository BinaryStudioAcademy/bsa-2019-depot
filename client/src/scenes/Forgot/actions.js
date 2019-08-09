import { types } from './types';

export const forgotActions = {
  emailSend: message => {
    return {
      type: types.EMAIL_SEND,
      payload: message
    };
  },
  emailNotExist: message => {
    return {
      type: types.EMAIL_NOT_EXIST,
      payload: message
    };
  },
  //Async
  forgotAsync: email => {
    return {
      type: types.FORGOT_ASYNC,
      payload: email
    };
  }
};

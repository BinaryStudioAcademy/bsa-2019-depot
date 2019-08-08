//Types
import { types } from './types';

export const forgotActions = {
    emailSend: () => {
        return {
            type: types.EMAIL_SEND
        };
    },
    emailNotExist: () => {
        return {
            type: types.EMAIL_NOT_EXIST
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

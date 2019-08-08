//Types

import { types } from './types';

const initialState = {
    emailSend: false,
    emailNotExist: false
};

export const forgotReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.EMAIL_SEND:
        return { ...state, emailSend: true };
    case types.EMAIL_NOT_EXIST:
        return { ...state, emailNotExist: true };
    default:
        return state;
    }
};

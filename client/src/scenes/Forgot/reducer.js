import { types } from './types';

const initialState = {
    emailSend: false,
    emailNotExist: false,
    message: ''
};

export const forgotReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.EMAIL_SEND:
        return { ...state, emailSend: true, message: action.payload };
    case types.EMAIL_NOT_EXIST:
        return { ...state, emailNotExist: true, message: action.payload };
    default:
        return state;
    }
};

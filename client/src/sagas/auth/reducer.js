//Types
import { types } from './types';

const initialState = {
    isAuthorized: false
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.AUTHENTICATE:
        return { ...state, isAuthorized: true };
    default:
        return state;
    }
};

//Types
import { types } from './types';

const initialState = {
    isAuthenticated: false
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.AUTHENTICATE:
        return { ...state, isAuthenticated: true };
    default:
        return state;
    }
};

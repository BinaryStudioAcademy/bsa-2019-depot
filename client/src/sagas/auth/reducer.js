import { types } from './types';

const initialState = {
    isAuthenticated: true
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.AUTHENTICATE:
        return { isAuthenticated: true };
    case types.UNAUTHENTICATE:
        return { isAuthenticated: false };
    default:
        return state;
    }
};

export default authReducer;

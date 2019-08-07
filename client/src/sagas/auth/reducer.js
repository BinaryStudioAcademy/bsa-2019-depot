//Types

import { types } from './types';

const initialState = {
    isAuthorized: false
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.AUTHENTICATE:
        return { isAuthorized: true };
    case types.UNAUTHENTICATE:
        return { isAuthorized: false };
    default:
        return state;
    }
};

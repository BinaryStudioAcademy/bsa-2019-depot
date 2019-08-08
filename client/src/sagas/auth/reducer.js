//Types

import { types } from './types';

const initialState = {
    isAuthorized: false
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.AUTHORIZE:
        return { isAuthorized: true };
    case types.UNAUTHORIZE:
        return { isAuthorized: false };
    default:
        return state;
    }
};

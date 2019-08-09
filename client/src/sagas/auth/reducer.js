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
    case types.LOGIN_FAILURE:
        return { isAuthorized: false };
    case types.LOGIN_SUCCESS:
        return { isAuthorized: true };
    default:
        return state;
    }
};

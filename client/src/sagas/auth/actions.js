//Types
import { types } from './types';

export const authActions = {
    //Sync
    authorize: () => {
        return {
            type: types.AUTHORIZE
        };
    },
    //Async
    loginAsync: credentials => {
        return {
            type: types.LOGIN_ASYNC,
            payload: credentials
        };
    },

    loginSuccess: () => {
        return {
            type: types.LOGIN_SUCCESS
        };
    },

    loginFailure: error => {
        return {
            type: types.LOGIN_FAILURE,
            payload: error
        };
    }
};

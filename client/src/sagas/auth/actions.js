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
    }
};

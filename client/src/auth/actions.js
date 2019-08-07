import { AUTHENTICATE_SUCCESS } from './actionTypes';

export const authSuccess = user => ({
    type: AUTHENTICATE_SUCCESS,
    payload: {
        user
    }
});

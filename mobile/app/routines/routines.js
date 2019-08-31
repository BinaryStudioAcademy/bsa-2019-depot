import { createRoutine } from 'redux-saga-routines';

export const signupRoutine = createRoutine('SIGNUP');
export const loginGoogleRoutine = createRoutine('LOGIN_GOOGLE');
export const setUsernameRoutine = createRoutine('SET_USERNAME');
export const fetchCurrentUser = createRoutine('CURRENT_USER');
export const authorizeUser = createRoutine('AUTHORIZE_USER');

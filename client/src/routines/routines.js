import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const signupRoutine = createRoutine('SIGNUP');
export const googleSignupRoutine = createRoutine('GOOGLE_SIGNUP');
export const setUsernameRoutine = createRoutine('SET_USERNAME');

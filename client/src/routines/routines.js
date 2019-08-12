import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
// export const loginRoutine = createRoutine('LOGIN');
export const signupRoutine = createRoutine('SIGNUP');
export const fillProfileRoutine = createRoutine('FILL_PROFILE');
export const loginGoogleRoutine = createRoutine('LOGIN_GOOGLE');
// export const googleSignupRoutine = createRoutine('GOOGLE_SIGNUP');
export const setUsernameRoutine = createRoutine('SET_USERNAME');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');
export const fetchRepoSettings = createRoutine('REPO_SETTINGS');
export const authorizeUser = createRoutine('AUTHORIZE_USER');
export const fetchCurrentUser = createRoutine('CURRENT_USER');

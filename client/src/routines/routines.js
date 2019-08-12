import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const signupRoutine = createRoutine('SIGNUP');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');
export const createRepository = createRoutine('CREATE_REPOSITORY');
export const checkRepoName = createRoutine('CHECK_REPO_NAME');
export const fetchCurrentUser = createRoutine('CURRENT_USER');
export const authorizeUser = createRoutine('AUTHORIZE_USER');

import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const signupRoutine = createRoutine('SIGNUP');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');
export const fetchRepoSettings = createRoutine('REPO_SETTINGS');
export const postRepoSettings = createRoutine('REPO_SETTINGS1');

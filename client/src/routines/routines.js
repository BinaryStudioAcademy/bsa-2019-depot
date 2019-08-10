import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const signupRoutine = createRoutine('SIGNUP');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');
export const fetchFileTree = createRoutine('TREE');
export const fetchLastCommitOnBranch = createRoutine('LAST_COMMIT');

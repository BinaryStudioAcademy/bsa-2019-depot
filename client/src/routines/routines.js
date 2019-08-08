import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');

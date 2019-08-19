import { createRoutine } from 'redux-saga-routines';

export const fetchIssues = createRoutine('ISSUES');
export const signupRoutine = createRoutine('SIGNUP');
export const fillProfileRoutine = createRoutine('FILL_PROFILE');
export const loginGoogleRoutine = createRoutine('LOGIN_GOOGLE');
export const setUsernameRoutine = createRoutine('SET_USERNAME');
export const fetchCommits = createRoutine('COMMITS');
export const fetchBranches = createRoutine('BRANCHES');
export const fetchFileTree = createRoutine('TREE');
export const fetchLastCommitOnBranch = createRoutine('LAST_COMMIT');
export const fetchCurrentUser = createRoutine('CURRENT_USER');
export const fetchRepoSettings = createRoutine('REPO_SETTINGS');
export const authorizeUser = createRoutine('AUTHORIZE_USER');
export const fetchDiffs = createRoutine('DIFFS');
export const updateUserSettings = createRoutine('UPDATE_USER_SETTINGS');
export const forkRepo = createRoutine('FORK_REPO');
export const createIssue = createRoutine('CREATE_ISSUE');
export const fetchCurrentRepoId = createRoutine('CURRENT_REPO_ID');
export const fetchIssueComments = createRoutine('ISSUE_COMMENTS');
export const createIssueComment = createRoutine('CREATE_ISSUE_COMMENTS');
export const createOrg = createRoutine('CREATE_ORG');

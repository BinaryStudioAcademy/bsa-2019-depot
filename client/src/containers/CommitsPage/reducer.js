import { fetchCommits, fetchBranches } from '../../routines/routines';

const initialCommitsState = {
    commits: [],
    loading: false,
    error: null
};

const initialBranchesState = {
    branches: [],
    loading: false,
    error: null
};

export const commitsData = (state = initialCommitsState, action) => {
    switch (action.type) {
    case fetchCommits.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchCommits.SUCCESS:
        return {
            ...state,
            commits: action.payload
        };
    case fetchCommits.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchCommits.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};

export const branchesData = (state = initialBranchesState, action) => {
    switch (action.type) {
    case fetchBranches.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchBranches.SUCCESS:
        return {
            ...state,
            branches: action.payload
        };
    case fetchBranches.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchBranches.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};

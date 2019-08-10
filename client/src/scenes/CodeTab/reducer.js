import { fetchBranches, fetchLastCommitOnBranch, fetchFileTree } from '../../routines/routines';

const initialLastCommitState = {
    commit: {
        sha: '',
        author: '',
        date: '',
        message: ''
    },
    loading: false,
    error: null
};

const initialFileTreeState = {
    tree: {
        directories: [],
        files: []
    },
    loading: false,
    error: null
};


export const lastCommitReducer = (state = initialLastCommitState, action) => {
    switch (action.type) {
    case fetchLastCommitOnBranch.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchLastCommitOnBranch.SUCCESS:
        return {
            ...state,
            commit: action.payload
        };
    case fetchLastCommitOnBranch.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchLastCommitOnBranch.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};

export const fileTreeReducer = (state = initialFileTreeState, action) => {
    switch (action.type) {
    case fetchFileTree.TRIGGER:
        return {
            ...state,
            loading: true
        };
    case fetchFileTree.SUCCESS:
        return {
            ...state,
            tree: action.payload
        };
    case fetchFileTree.FAILURE:
        return {
            ...state,
            error: action.payload
        };
    case fetchFileTree.FULFILL:
        return {
            ...state,
            loading: false
        };
    default:
        return state;
    }
};
import { fetchLastCommitOnBranch, fetchFileTree, fetchCommitCount } from '../../routines/routines';

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
    files: [],
    parentDir: '',
    currentPath: ''
  },
  loading: false,
  error: null
};

const initialCommitCountState = {
  count: {},
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

export const commitCountReducer = (state = initialCommitCountState, action) => {
  switch (action.type) {
  case fetchCommitCount.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchCommitCount.SUCCESS:
    return {
      ...state,
      count: action.payload
    };
  case fetchCommitCount.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchCommitCount.FULFILL:
    return {
      ...state,
      loading: false
    };
  default:
    return state;
  }
};

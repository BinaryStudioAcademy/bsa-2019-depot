import { fetchFileTree, fetchBranch } from '../../routines/routines';
import { NEW_FILE } from './actionTypes';

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

const initialBranchState = {
  commitsCount: { count: 0 },
  headCommit: {},
  loading: true,
  error: null
};

const initialEditFileState = {
  filename: '',
  content: ''
};

export const newFileReducer = (state = initialEditFileState, action) => {
  switch (action.type) {
  case NEW_FILE:
    return {
      ...state,
      filename: action.payload.filename,
      content: action.payload.content
    };
  default:
    return state;
  }
};

export const branchReducer = (state = initialBranchState, action) => {
  switch (action.type) {
  case fetchBranch.TRIGGER:
    return {
      ...state,
      loading: true
    };
  case fetchBranch.SUCCESS:
    return {
      ...state,
      ...action.payload
    };
  case fetchBranch.FAILURE:
    return {
      ...state,
      error: action.payload
    };
  case fetchBranch.FULFILL:
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

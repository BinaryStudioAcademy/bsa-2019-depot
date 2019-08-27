import { fetchLastCommitOnBranch, fetchFileTree, fetchBranch } from '../../routines/routines';
import { NEW_FILE } from './actionTypes';


const initialBranchState = {
  commitsCount: null,
      latestCommit: {},
  fileTree: {
    directories: [],
    files: [],
    parentDir: '',
    currentPath: ''
  },
  loading: false,
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
}

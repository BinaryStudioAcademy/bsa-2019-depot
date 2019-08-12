import * as types from './types';

export const renameRepo = ({ name, owner, oldName }) => ({
  type: types.RENAME_REPO,
  payload: {
    name,
    owner,
    oldName
  }
});

export const deleteRepo = ({ name, owner }) => ({
  type: types.DELETE_REPO,
  payload: {
    name,
    owner
  }
});

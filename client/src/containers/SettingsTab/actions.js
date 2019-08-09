import * as types from './types';

export const changePrivacy = ({ owner, name, isPublic }) => ({
    type: types.CHANGE_PRIVACY,
    payload: {
        owner,
        name,
        isPublic
    }
});

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

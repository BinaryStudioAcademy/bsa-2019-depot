export const changePrivacy = ({ owner, name, isPublic }) => ({
    type: 'CHANGE_PRIVACY',
    payload: {
        owner,
        name,
        isPublic
    }
});

export const renameRepo = ({ name, owner, oldName }) => ({
    type: 'RENAME_REPO',
    payload: {
        name,
        owner,
        oldName
    }
});

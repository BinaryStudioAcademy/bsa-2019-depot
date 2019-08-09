import callWebApi from '../helpers/webApiHelper';

export const getSettings = async ({ owner, name }) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${name}/settings`,
        type: 'GET'
    });
    return response.json();
};

export const renameRepo = async ({ owner, name, oldName }) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${oldName}/settings/rename`,
        type: 'post',
        request: {
            newName: name
        }
    });
    return response.json();
};

export const changePrivacy = async ({ owner, name }) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${name}/settings/privacy`,
        type: 'post'
    });
    return response.json();
};

export const deleteRepo = async ({ owner, name }) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${name}/settings/delete`,
        type: 'delete'
    });
    return response.json();
};

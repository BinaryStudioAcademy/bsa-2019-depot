import callWebApi from '../helpers/webApiHelper';

export const getBranches = async (owner, repoName) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${repoName}/branches`,
        type: 'GET'
    });
    return response.json();
};


export const getLastCommit = async (owner, repoName, branch) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${repoName}/${branch}/last-commit`,
        type: 'GET'
    });
    return response.json();
};


export const getFileTree = async (owner, repoName, branch) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${repoName}/${branch}/tree`,
        type: 'GET'
    });
    return response.json();
};

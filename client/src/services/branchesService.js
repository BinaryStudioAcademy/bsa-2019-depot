import callWebApi from '../helpers/webApiHelper';

export const getBranches = async (owner, repoName) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${repoName}/branches`,
        type: 'GET'
    });
    return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const getCommits = async (owner, repoName, branch) => {
    const response = await callWebApi({
        endpoint: `/repo/${owner}/${repoName}/${branch}/commits`,
        type: 'GET'
    });
    return response.json();
};

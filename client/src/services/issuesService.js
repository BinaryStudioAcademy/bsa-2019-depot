import callWebApi from '../helpers/webApiHelper';

export const getIssues = async ({ username: owner, repoName, repositoryId }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/issues`,
    type: 'GET',
    query: {
      repositoryId
    }
  });
  return response.json();
};

export const createIssue = async ({ username: owner, repoName, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/issues`,
    type: 'POST',
    request
  });
  return response.json();
};

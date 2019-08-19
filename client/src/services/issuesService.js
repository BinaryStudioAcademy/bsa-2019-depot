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

export const getIssueComments = async ({ username: owner, repoName, issueNumber }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/issues/${issueNumber}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const postIssueComment = async ({ username: owner, repoName, issueNumber, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/issues/${issueNumber}/comments`,
    type: 'POST',
    request
  });
  return response.json();
};

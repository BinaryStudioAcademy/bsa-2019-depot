import callWebApi from '../helpers/webApiHelper';

export const getIssues = async ({ username: owner, reponame, repositoryId }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/issues`,
    type: 'GET',
    query: {
      repositoryId
    }
  });
  return response.json();
};

export const createIssue = async ({ username: owner, reponame, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/issues`,
    type: 'POST',
    request
  });
  return response.json();
};

export const getIssueComments = async ({ username: owner, reponame, issueNumber, issueId }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/issues/${issueNumber}/comments`,
    type: 'GET',
    query: {
      issueId
    }
  });
  return response.json();
};

export const postIssueComment = async ({ username: owner, reponame, issueNumber, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/issues/${issueNumber}/comments`,
    type: 'POST',
    request
  });
  return response.json();
};

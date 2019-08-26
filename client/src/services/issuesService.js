import callWebApi from '../helpers/webApiHelper';

export const getIssues = async ({ username: owner, reponame, repositoryId }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/issues`,
    type: 'GET',
    query: {
      repositoryId
    }
  });
  return response.json();
};

export const getIssueByNumber = async ({ username: owner, reponame, number }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/issues/${number}`,
    type: 'GET'
  });
  return response.json();
};

export const createIssue = async ({ username: owner, reponame, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/issues`,
    type: 'POST',
    request
  });
  return response.json();
};

export const getIssueComments = async ({ username: owner, reponame, issueId }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/issues/${issueId}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const postIssueComment = async ({ username: owner, reponame, issueId, ...request }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/issues/${issueId}/comments`,
    type: 'POST',
    request
  });
  return response.json();
};

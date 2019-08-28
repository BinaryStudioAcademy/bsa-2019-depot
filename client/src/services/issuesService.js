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

export const getIssueByNumber = async (reponame, number) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${reponame}/issues/${number}`,
    type: 'GET'
  });
  return response.json();
};

export const createIssue = async request => {
  const response = await callWebApi({
    endpoint: '/api/issues',
    type: 'POST',
    request
  });
  return response.json();
};

export const getIssueComments = async issueId => {
  const response = await callWebApi({
    endpoint: `/api/issues/${issueId}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const postIssueComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/issue-comments',
    type: 'POST',
    request
  });
  return response.json();
};

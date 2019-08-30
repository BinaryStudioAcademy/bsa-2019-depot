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

export const getIssueByNumber = async (username, reponame, number) => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/repos/${reponame}/issues/${number}`,
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

export const updateIssue = async request => {
  const response = await callWebApi({
    endpoint: '/api/issues',
    type: 'PUT',
    request
  });
  return response.json();
};

export const closeIssue = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/issues/${id}/close`,
    type: 'PUT'
  });
  return response.json();
};

export const reopenIssue = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/issues/${id}/reopen`,
    type: 'PUT'
  });
  return response.json();
};

export const deleteIssue = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/issues/${id}`,
    type: 'DELETE'
  });
  return response ? true : false;
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

export const getAllIssues = async (username, params) => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/issues`,
    type: 'GET',
    query: params
  });
  return response.json();
};

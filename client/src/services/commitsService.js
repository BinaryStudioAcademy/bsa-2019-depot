import callWebApi from '../helpers/webApiHelper';

export const getCommits = async (repoId, branchName) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/branches/${branchName}/commits`,
    type: 'GET'
  });
  return response.json();
};

export const getCommitCount = async (owner, repoName, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${branch}/count`,
    type: 'GET'
  });
  return response.json();
};

export const getAllUserCommits = async owner => {
  const response = await callWebApi({
    endpoint: `/api/users/${owner}/contribution-activity`,
    type: 'GET'
  });
  return response.json();
};

export const getCommitDiffs = async (owner, repoName, hash) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${repoName}/${hash}/commit`,
    type: 'GET'
  });
  return response.json();
};

export const modifyFile = async (owner, repoName, branch, request) => {
  const response = await callWebApi({
    endpoint: `/api/commits/${owner}/${repoName}/${branch}/`,
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteCommitComment = async (id, userId) => {
  const response = await callWebApi({
    endpoint: `/api/commit-comments/${id}`,
    type: 'DELETE',
    request: { userId }
  });
  return response.json();
};

export const addCommitComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/commit-comments',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateCommitComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/commit-comments',
    type: 'PUT',
    request
  });
  return response.json();
};

export const getCommitComments = async id => {
  const response = await callWebApi({
    endpoint: `/api/commit-comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const getCommits = async (owner, repoName, branch) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/${branch}/commits`,
    type: 'GET'
  });
  return response.json();
};

export const getAllUserCommits = async owner => {
  const response = await callWebApi({
    endpoint: `/api/commit/${owner}/commits`,
    type: 'GET'
  });
  return response.json();
};

export const getCommitDiffs = async (owner, repoName, hash) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${repoName}/${hash}/commit`,
    type: 'GET'
  });
  return response.json();
};

export const modifyFile = async (owner, repoName, branch, request) => {
  const response = await callWebApi({
    endpoint: `/api/commit/${owner}/${repoName}/${branch}/`,
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteCommitComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/commit-comments/${id}`,
    type: 'DELETE'
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

import callWebApi from '../helpers/webApiHelper';

export const getBranchDiffs = async (repoId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/pulls/diffs`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getUserPulls = async (username, params) => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/pulls`,
    type: 'GET',
    query: params
  });
  return response.json();
};

export const createPull = async request => {
  const response = await callWebApi({
    endpoint: '/api/pulls',
    type: 'POST',
    request
  });
  return response.json();
};

export const getPullByNumber = async (username, reponame, number) => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/repos/${reponame}/pulls/${number}`,
    type: 'GET'
  });
  return response.json();
};

export const getPullComments = async pullId => {
  const response = await callWebApi({
    endpoint: `/api/pulls/${pullId}/comments`,
    type: 'GET'
  });
  return response.json();
};

export const updatePull = async request => {
  const response = await callWebApi({
    endpoint: '/api/pulls',
    type: 'PUT',
    request
  });
  return response.json();
};

export const closePull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/pulls/${id}/close`,
    type: 'PUT'
  });
  return response.json();
};

export const reopenPull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/pulls/${id}/reopen`,
    type: 'PUT'
  });
  return response.json();
};

export const mergePull = async request => {
  const { id } = request;
  const response = await callWebApi({
    endpoint: `/api/pulls/${id}/merge`,
    type: 'PUT'
  });
  return response.json();
};

export const getReviewers = async id => {
  const response = await callWebApi({
    endpoint: `/api/pulls/${id}/reviewers`,
    type: 'GET'
  });
  return response.json();
};

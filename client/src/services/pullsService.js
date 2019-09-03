import callWebApi from '../helpers/webApiHelper';

export const getBranchDiffs = async (repoId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/pulls/diffs`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getPulls = async ({ repositoryId: repoID }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoID}/pulls`,
    type: 'GET'
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
import callWebApi from '../helpers/webApiHelper';

export const getBranchDiffs = async (repoId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repoId}/pulls/diffs`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getPulls = async ({ username: owner, reponame, repositoryId }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/pulls`,
    type: 'GET',
    query: {
      repositoryId
    }
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

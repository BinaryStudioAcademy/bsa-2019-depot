import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async owner => {
  const response = await callWebApi({
    endpoint: `/api/users/${owner}/repos`,
    type: 'GET'
  });
  return response.json();
};

export const getPublicOnlyRepositories = async owner => {
  const response = await callWebApi({
    endpoint: `/api/users/${owner}/public-repos`,
    type: 'GET'
  });
  return response.json();
};

export const getRepositoryByOwnerAndName = async ({ username: owner, reponame }) => {
  const response = await callWebApi({
    endpoint: `/api/users/${owner}/repos/${reponame}`,
    type: 'GET'
  });
  return response.json();
};

export const createRepository = async request => {
  const response = await callWebApi({
    endpoint: '/api/repos',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateRepositoryByOwnerAndName = async ({ owner, reponame, request }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const changeRepoType = async ({ owner, reponame, request }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/change-type`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const checkName = async ({ owner, reponame }) => {
  if (!owner || !reponame) return 'invalid data';

  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/check-name`,
    type: 'GET'
  });
  return response.json();
};

export const checkIfEmpty = async ({ owner, reponame }) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${owner}/${reponame}/is-empty`,
    type: 'GET'
  });
  return response.json();
};
export const forkRepo = async request => {
  const response = await callWebApi({
    endpoint: '/api/repos/fork',
    type: 'POST',
    request
  });
  return response.json();
};

export const setStar = async request => {
  const response = await callWebApi({
    endpoint: '/api/repos/star',
    type: 'PUT',
    request
  });
  return response.json();
};

export const getRepositoryCollaborators = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/collaborators`,
    type: 'GET'
  });
  return response.json();
};

export const getRepositoryIssues = async (repositoryId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/issues`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getForksList = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/forks`,
    type: 'GET'
  });
  return response.json();
};

export const getStargazersList = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/stargazers`,
    type: 'GET'
  });
  return response.json();
};

export const getRepositoryPulls = async (repositoryId, query) => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/pulls`,
    type: 'GET',
    query
  });
  return response.json();
};

export const getCommitActivity = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/commit-activity-data`,
    type: 'GET'
  });
  return response.json();
};
export const getAvailableAssigneesByRepoId = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/available-assignees`,
    type: 'GET'
  });
  return response.json();
};
export const getCommitActivityByUser = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/repos/${repositoryId}/commit-activity-data-by-user`,
    type: 'GET'
  });
  return response.json();
};

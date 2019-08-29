import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async owner => {
  const response = await callWebApi({
    endpoint: `/api/users/${owner}/repos`,
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
    endpoint: `/api/repo/${owner}/${reponame}/change-type`,
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

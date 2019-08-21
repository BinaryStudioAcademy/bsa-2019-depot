import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async (owner) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/repos`,
    type: 'GET'
  });
  return response.json();
};

export const getRepositoryByOwnerAndName = async ({ username: owner, reponame }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}`,
    type: 'GET'
  });
  return response.json();
};

export const createRepository = async request => {
  const response = await callWebApi({
    endpoint: '/api/repo',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateRepositoryByOwnerAndName = async ({ owner, reponame, request }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}`,
    type: 'PUT',
    request
  });
  return response.json();
};

export const checkName = async ({ owner, reponame }) => {
  if (!owner || !reponame) return 'invalid data';

  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/check-name`,
    type: 'GET'
  });
  return response.json();
};

export const checkIfEmpty = async ({ owner, reponame }) => {
  const response = await callWebApi({
    endpoint: `/api/repo/${owner}/${reponame}/is-empty`,
    type: 'GET'
  });
  return response.json();
};
export const forkRepo = async request => {
  const response = await callWebApi({
    endpoint: `/api/repo/fork`,
    type: 'POST',
    request
  });
  return response.json();
};

export const setStar = async request => {
  const response = await callWebApi({
    endpoint: '/api/repo/star',
    type: 'PUT',
    request
  });
  return response.json();
};

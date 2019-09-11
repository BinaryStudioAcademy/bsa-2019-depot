import callWebApi from '../helpers/webApiHelper';

export const forgot = async request => {
  const response = await callWebApi({
    endpoint: '/api/users/forgot-password',
    type: 'PUT',
    request
  });
  return response.json();
};

export const reset = async request => {
  const response = await callWebApi({
    endpoint: '/api/users/reset-password',
    type: 'PUT',
    request
  });
  return response.json();
};

export const updateSettings = async request => {
  const response = await callWebApi({
    endpoint: '/api/users',
    type: 'PUT',
    request
  });
  return response.json();
};

export const uploadUserPhoto = async request => {
  const response = await callWebApi({
    endpoint: '/api/users/image',
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteUserPhoto = async request => {
  const response = await callWebApi({
    endpoint: '/api/users/image',
    type: 'DELETE',
    request
  });
  return response.json();
};

export const getKeys = async userId => {
  const response = await callWebApi({
    endpoint: `/api/users/${userId}/keys`,
    type: 'GET'
  });
  return response.json();
};

export const addKey = async request => {
  const response = await callWebApi({
    endpoint: '/api/keys',
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteKey = async keyId => {
  return callWebApi({
    endpoint: `/api/keys/${keyId}`,
    type: 'DELETE'
  });
};

export const getUserDetailed = async username => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/overview`,
    type: 'GET'
  });
  return response.json();
};

export const getStars = async username => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/stars`,
    type: 'GET'
  });
  return response.json();
};

export const checkUsernameExists = async username => {
  const response = await callWebApi({
    endpoint: `/api/users/username-exists?username=${username}`,
    type: 'GET'
  });
  return response.json();
};

export const getUsersToInviting = async (username, orgID) => {
  const response = await callWebApi({
    endpoint: `/api/users/search/${username}/${orgID}`,
    type: 'GET'
  });
  return response.json();
};

export const getUsersOrganizations = async userid => {
  const response = await callWebApi({
    endpoint: `/api/users/${userid}/organizations`,
    type: 'GET'
  });
  return response.json();
};

export const getUsersForCollaboratorsAddition = async (username, repositoryId, userId) => {
  const response = await callWebApi({
    endpoint: `/api/users/search/collaborators/${username}/${repositoryId}/${userId}`,
    type: 'GET'
  });
  return response.json();
};

export const setPinnedRepos = async request => {
  const response = await callWebApi({
    endpoint: '/api/users/set-pinned-repos',
    type: 'POST',
    request
  });
  return response.json();
};

export const getPinnedRepos = async userId => {
  const response = await callWebApi({
    endpoint: `/api/users/${userId}/pinned-repositories`,
    type: 'GET'
  });
  return response.json();
};

export const setStatus = async status => {
  const response = await callWebApi({
    endpoint: '/api/users/set-status',
    type: 'POST',
    request: {
      status
    }
  });
  return response.json();
};

export const getStatus = async username => {
  const response = await callWebApi({
    endpoint: `/api/users/${username}/status`,
    type: 'GET'
  });
  return response.json();
};

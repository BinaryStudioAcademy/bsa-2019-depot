import callWebApi from '../helpers/webApiHelper';

export const forgot = async request => {
  const response = await callWebApi({
    endpoint: '/api/user/forget-password',
    type: 'POST',
    request
  });
  return response.json();
};

export const reset = async request => {
  const response = await callWebApi({
    endpoint: '/api/user/reset-password',
    type: 'POST',
    request
  });
  return response.json();
};

export const updateSettings = async request => {
  const response = await callWebApi({
    endpoint: '/api/user/settings',
    type: 'POST',
    request
  });
  return response.json();
};

export const getKeys = async () => {
  const response = await callWebApi({
    endpoint: '/api/user/keys',
    type: 'GET'
  });
  return response.json();
};

export const addKey = async request => {
  const response = await callWebApi({
    endpoint: '/api/user/keys',
    type: 'POST',
    request
  });
  return response.json();
};

export const deleteKey = async keyId => {
  return callWebApi({
    endpoint: `/api/user/keys/${keyId}`,
    type: 'DELETE'
  });
};

export const getUserDetailed = async username => {
  const response = await callWebApi({
    endpoint: `/api/user/${username}`,
    type: 'GET'
  });
  return response.json();
};

export const getStars = async username => {
  const response = await callWebApi({
    endpoint: `/api/user/${username}/stars`,
    type: 'GET'
  });
  return response.json();
};

export const checkUsernameExists = async username => {
  const response = await callWebApi({
    endpoint: `/api/user/username-exists?username=${username}`,
    type: 'GET'
  });
  return response.json();
};

export const getUsersOrganizations = async userid => {
  const response = await callWebApi({
    endpoint: `/api/user/${userid}/organizations`,
    type: 'GET'
  });
  return response.json();
};

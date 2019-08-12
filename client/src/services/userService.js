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

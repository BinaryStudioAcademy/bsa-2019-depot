import callWebApi from '../helpers/webApiHelper';

export const signup = async request => {
  const response = await callWebApi({
    endpoint: '/api/auth/register',
    type: 'POST',
    request
  });
  return response.json();
};

export const googleSignup = async () => {
  const response = await callWebApi({
    endpoint: '/api/auth/google',
    type: 'GET'
  });
  return response.json();
};

export const setToken = token => {
  localStorage.setItem('token', token);
};

export const setUsername = async (username, profile) => {
  const request = {
    username,
    profile
  };
  const response = await callWebApi({
    endpoint: '/api/users/username',
    type: 'POST',
    request
  });
  return response.json();
};

export const checkUsername = async username => {
  const response = await callWebApi({
    endpoint: '/api/users/username-exists',
    type: 'GET',
    query: {
      username
    }
  });
  return response.json();
};

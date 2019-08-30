import callWebApi from '../helpers/webApiHelper';

export const login = async request => {
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/auth/login',
    type: 'POST',
    request
  });
  return response.json();
};

export const getCurrentUser = async () => {
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/auth/user',
    type: 'GET'
  });
  return response.json();
};

export const signup = async request => {
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/auth/register',
    type: 'POST',
    request
  });
  return response.json();
};

export const googleSignup = async request => {
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/auth/google/mobile',
    type: 'POST',
    request
  });
  return response.json();
};

export const setUsername = async (username, profile) => {
  const request = {
    username,
    profile
  };
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/users/username',
    type: 'POST',
    request
  });
  return response.json();
};

export const checkUsername = async username => {
  const response = await callWebApi({
    endpoint: 'http://10.0.2.2:3000/api/users/username-exists',
    type: 'GET',
    query: {
      username
    }
  });
  return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const checkUsernameExists = async username => {
  const response = await callWebApi({
    endpoint: `http://10.0.2.2:3000/api/users/username-exists?username=${username}`,
    type: 'GET'
  });
  return response.json();
};

export const getUserDetailed = async username => {
  const response = await callWebApi({
    endpoint: `http://10.0.2.2:3000/api/users/${username}/overview`,
    type: 'GET'
  });
  return response.json();
};

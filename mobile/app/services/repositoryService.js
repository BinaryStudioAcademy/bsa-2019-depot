import callWebApi from '../helpers/webApiHelper';

export const getRepositories = async owner => {
  const response = await callWebApi({
    endpoint: `http://10.0.2.2:3000/api/users/${owner}/repos`,
    type: 'GET'
  });
  return response.json();
};

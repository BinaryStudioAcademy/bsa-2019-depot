import callWebApi from '../helpers/webApiHelper';

export const getAllIssues = async (username, params) => {
  const response = await callWebApi({
    endpoint: `http://10.0.2.2:3000/api/users/${username}/issues`,
    type: 'GET',
    query: params
  });
  return response.json();
};

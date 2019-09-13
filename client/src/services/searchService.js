import callWebApi from '../helpers/webApiHelper';

export const find = async (user, repo) => {
  const response = await callWebApi({
    endpoint: '/api/search',
    type: 'GET',
    query: {
      user,
      repo
    }
  });
  return response.json();
};

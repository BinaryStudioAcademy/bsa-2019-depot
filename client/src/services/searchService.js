import callWebApi from '../helpers/webApiHelper';

export const find = async input => {
  const response = await callWebApi({
    endpoint: '/api/search',
    type: 'GET',
    query: {
      input
    }
  });
  return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const create = async request => {
  const response = await callWebApi({
    endpoint: '/api/organizations/new',
    type: 'POST',
    request
  });
  return response.json();
};

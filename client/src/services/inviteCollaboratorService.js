import callWebApi from '../helpers/webApiHelper';

export const invite = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators/invite',
    type: 'POST',
    request
  });
  return response.json();
};

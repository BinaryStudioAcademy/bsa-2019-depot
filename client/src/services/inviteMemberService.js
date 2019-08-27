import callWebApi from '../helpers/webApiHelper';

export const invite = async request => {
  const response = await callWebApi({
    endpoint: '/api/orgs/invite',
    type: 'POST',
    request
  });
  return response.json();
};

export const acceptInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/orgs/invitation',
    type: 'POST',
    request
  });
  return response.json();
};

export const cancelInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/orgs/invitation',
    type: 'DELETE',
    request
  });
  return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const invite = async request => {
  const response = await callWebApi({
    endpoint: '/api/organizations/invite',
    type: 'POST',
    request
  });
  return response.json();
};

export const isInvited = async query => {
  const response = await callWebApi({
    endpoint: '/api/organizations/user-invited',
    type: 'GET',
    query
  });
  return response.json();
};

export const acceptInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/organizations/accept-invitation',
    type: 'POST',
    request
  });
  return response.json();
};

export const cancelInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/organizations/cancel-invitation',
    type: 'DELETE',
    request
  });
  return response.json();
};

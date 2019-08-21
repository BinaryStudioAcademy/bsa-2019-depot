import callWebApi from '../helpers/webApiHelper';

export const create = async request => {
  const response = await callWebApi({
    endpoint: '/api/organizations/new',
    type: 'POST',
    request
  });
  return response.json();
};

export const getOrgMembers = async orgID => {
  const response = await callWebApi({
    endpoint: `/api/organizations/${orgID}/users`,
    type: 'GET'
  });
  return response.json();
};

export const getOrgOwner = async orgID => {
  const response = await callWebApi({
    endpoint: `/api/organizations/${orgID}/owner`,
    type: 'GET'
  });
  return response.json();
};

import callWebApi from '../helpers/webApiHelper';

export const create = async request => {
  const response = await callWebApi({
    endpoint: '/api/orgs',
    type: 'POST',
    request
  });
  return response.json();
};

export const getOrgMembers = async orgID => {
  const response = await callWebApi({
    endpoint: `/api/orgs/${orgID}/users`,
    type: 'GET'
  });
  return response.json();
};

export const getOrgOwner = async orgID => {
  const response = await callWebApi({
    endpoint: `/api/orgs/${orgID}/owner`,
    type: 'GET'
  });
  return response.json();
};

export const getRelationUserOrg = async (orgname, userID) => {
  const response = await callWebApi({
    endpoint: `/api/orgs/${orgname}/users/${userID}`,
    type: 'GET'
  });
  return response.json();
};

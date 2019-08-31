import callWebApi from '../helpers/webApiHelper';

export const getRepositoryCollaborators = async repositoryId => {
  const response = await callWebApi({
    endpoint: `/api/collaborators/${repositoryId}`,
    type: 'GET'
  });
  return response.json();
};

export const removeRepositoryCollaborator = async collaboratorId => {
  const response = await callWebApi({
    endpoint: `/api/collaborators/${collaboratorId}`,
    type: 'DELETE'
  });
  return response.json();
};

export const invite = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators/invite',
    type: 'POST',
    request
  });
  return response.json();
};

export const getUserInvitationStatus = async (username, reponame, userId) => {
  const response = await callWebApi({
    endpoint: `/api/collaborators/${username}/${reponame}/${userId}`,
    type: 'GET'
  });
  return response.json();
};

export const acceptInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators',
    type: 'POST',
    request
  });
  return response.json();
};

export const declineInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators',
    type: 'DELETE',
    request
  });
  return response.json();
};

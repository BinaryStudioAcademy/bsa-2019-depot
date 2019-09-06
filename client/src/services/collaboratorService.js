import callWebApi from '../helpers/webApiHelper';

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
    endpoint: `/api/collaborators/${userId}/status`,
    type: 'GET',
    query: {
      username,
      reponame
    }
  });
  return response.json();
};

export const acceptInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators/accept',
    type: 'PUT',
    request
  });
  return response.json();
};

export const declineInvitation = async request => {
  const response = await callWebApi({
    endpoint: '/api/collaborators/decline',
    type: 'DELETE',
    request
  });
  return response.json();
};

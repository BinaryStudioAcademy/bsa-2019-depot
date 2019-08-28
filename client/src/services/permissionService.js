import callWebApi from '../helpers/webApiHelper';

export const getUserRights = async (username, reponame, userId) => {
  const response = await callWebApi({
    endpoint: `/api/collaborators/permissions/${username}/${reponame}/${userId}`,
    type: 'GET'
  });
  return response.json();
};

const permissionRepository = require('../../data/repositories/permission.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
const repositoryRepository = require('../../data/repositories/repository.repository');
const { getByUserAndReponame } = require('./repo.service');

const { getUserDetailed } = require('./user.service');
const { sendInviteCollaboratorEmail } = require('./email.service');

const addCollaborator = async ({ recipient, username, reponame, repositoryId, url, permission }) => {
  const { email, id: userId } = await getUserDetailed(recipient);

  // await sendInviteCollaboratorEmail({ email, url, username, reponame });

  const { id: permissionId } = await permissionRepository.getPermissionByName(permission);

  await collaboratorRepository.create({
    permissionId,
    userId,
    repositoryId,
    isActivated: false
  });
  return await getRepositoryCollaborators(repositoryId);
};

const getRepositoryCollaborators = repositoryId => collaboratorRepository.getCollaboratorsByRepositoryId(repositoryId);

const getUserInvitationStatus = async (username, reponame, userId) => {
  const { id: repositoryId } = await repositoryRepository.getByUsernameAndReponame(username, reponame);
  return await collaboratorRepository.getUserInvitationStatus(userId, repositoryId);
};

const acceptInvitation = async (username, reponame, userId) => {
  const [{ id }] = await getUserInvitationStatus(username, reponame, userId);
  await collaboratorRepository.updateById(id, {
    isActivated: true
  });
  return {
    status: true
  };
};

const declineInvitation = async (username, reponame, userId) => {
  const [{ id }] = await getUserInvitationStatus(username, reponame, userId);
  await collaboratorRepository.deleteById(id);
  return {
    status: true
  };
};

const removeRepositoryCollaborator = async (collaboratorId) => {
  await collaboratorRepository.deleteById(collaboratorId);
  return {
    status: true
  };
};

const getUserRights = async (username, reponame, userId) => {
  const { id: repositoryId } = await getByUserAndReponame({ owner: username, reponame });
  return await collaboratorRepository.getUserRights(userId, repositoryId);
};

module.exports = {
  addCollaborator,
  getUserRights,
  getRepositoryCollaborators,
  getUserInvitationStatus,
  acceptInvitation,
  declineInvitation,
  removeRepositoryCollaborator
};

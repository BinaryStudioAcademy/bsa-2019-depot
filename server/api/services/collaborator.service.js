const permissionRepository = require('../../data/repositories/permission.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
const repositoryRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const { getByUserAndReponame } = require('./repo.service');

const { getUserDetailed } = require('./user.service');
const { sendInviteCollaboratorEmail } = require('./email.service');

const getRepositoryCollaborators = repositoryId => collaboratorRepository.getCollaboratorsByRepositoryId(repositoryId);

const addCollaborator = async ({
  recipient, username, reponame, repositoryId, url, permission
}) => {
  const { email, id: userId } = await getUserDetailed(recipient);

  await sendInviteCollaboratorEmail({
    email,
    url,
    username,
    reponame
  });

  const { id: permissionId } = await permissionRepository.getPermissionByName(permission);

  await collaboratorRepository.create({
    permissionId,
    userId,
    repositoryId,
    isActivated: false
  });
  return getRepositoryCollaborators(repositoryId);
};

const getUserInvitationStatus = async (username, reponame, userId) => {
  const { id: ownerId } = await userRepository.getByUsername(username);
  const { id: repositoryId } = await repositoryRepository.getByUserAndReponame(ownerId, reponame);
  return collaboratorRepository.getUserInvitationStatus(userId, repositoryId);
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
  return collaboratorRepository.getUserRights(userId, repositoryId);
};

const getUserRightsByUserIdAndRepositoryId = (userId, repositoryId) => collaboratorRepository.getUserRights(userId, repositoryId);

module.exports = {
  addCollaborator,
  getUserRights,
  getRepositoryCollaborators,
  getUserInvitationStatus,
  acceptInvitation,
  declineInvitation,
  removeRepositoryCollaborator,
  getUserRightsByUserIdAndRepositoryId
};

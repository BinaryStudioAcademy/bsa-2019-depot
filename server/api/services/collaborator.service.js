const permissionRepository = require('../../data/repositories/permission.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
const repositoryRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const orgUserRepository = require('../../data/repositories/org-user.repository');
const { getByUserAndReponame } = require('./repo.service');

const { getUserDetailed } = require('./user.service');
const { sendInviteCollaboratorEmail } = require('./email.service');

const addCollaborator = async ({
  recipient, username, reponame, repositoryId, url, permission
}) => {
  const { email, id: userId } = await getUserDetailed(recipient);
  const { id: permissionId } = await permissionRepository.getPermissionByName(permission);

  const { id } = await collaboratorRepository.create({
    permissionId,
    userId,
    repositoryId,
    isActivated: false
  });

  await sendInviteCollaboratorEmail({
    email,
    url,
    username,
    reponame
  });
  return collaboratorRepository.getCollaboratorById(id);
};

const getUserInvitationStatus = async (username, reponame, userId) => {
  const { id: ownerId } = await userRepository.getByUsername(username);
  const { id: repositoryId } = await repositoryRepository.getByUserAndReponame(ownerId, reponame);
  return collaboratorRepository.getUserInvitationStatus(userId, repositoryId);
};

const acceptInvitation = async (username, reponame, userId) => {
  const [{ id }] = await getUserInvitationStatus(username, reponame, userId);
  return collaboratorRepository.updateById(id, {
    isActivated: true
  });
};

const declineInvitation = async (username, reponame, userId) => {
  const [{ id }] = await getUserInvitationStatus(username, reponame, userId);
  await collaboratorRepository.deleteById(id);
  return {};
};

const removeRepositoryCollaborator = async (collaboratorId) => {
  await collaboratorRepository.deleteById(collaboratorId);
  return {};
};

const getUserRights = async (username, reponame, userId) => {
  const { id: repositoryId } = await getByUserAndReponame({ owner: username, reponame });
  const collaboratorRights = await collaboratorRepository.getUserRights(userId, repositoryId);

  if (collaboratorRights.length) {
    return collaboratorRights;
  }
  const { id: orgId } = await userRepository.getByUsername(username);
  const result = await orgUserRepository.getUserWithOwnerRole({ userId, orgId });
  return [result];
};

const getUserRightsByUserIdAndRepositoryId = (userId, repositoryId) => collaboratorRepository.getUserRights(userId, repositoryId);

module.exports = {
  addCollaborator,
  getUserRights,
  getUserInvitationStatus,
  acceptInvitation,
  declineInvitation,
  removeRepositoryCollaborator,
  getUserRightsByUserIdAndRepositoryId
};

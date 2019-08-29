const permissionRepository = require('../../data/repositories/permission.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
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

const removeRepositoryCollaborator = async (collaboratorId) => {
  await collaboratorRepository.deleteById(collaboratorId);
  return {
    status: true
  }
};

const getUserRights = async (username, reponame, userId) => {
  const { id: repositoryId } = await getByUserAndReponame({ owner: username, reponame });
  return await collaboratorRepository.getUserRights(userId, repositoryId);
};

module.exports = {
  addCollaborator,
  getUserRights,
  getRepositoryCollaborators,
  removeRepositoryCollaborator
};

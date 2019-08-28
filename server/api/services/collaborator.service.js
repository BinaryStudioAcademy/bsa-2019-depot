const permissionRepository = require('../../data/repositories/permission.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');

const { getUserDetailed } = require('./user.service');
const { sendInviteCollaboratorEmail } = require('./email.service');

const addCollaborator = async ({ senderUsername, username, reponame, repositoryId, url, permission }) => {
  const { email, id: userId } = await getUserDetailed(username);

  // await sendInviteCollaboratorEmail({ email, url, senderUsername, reponame });

  const { id: permissionId } = await permissionRepository.getPermissionByName(permission);

  await collaboratorRepository.create({
    permissionId,
    userId,
    repositoryId,
    // isActivated: false
  });
  return {
    status: true
  };
};

module.exports = {
  addCollaborator
};

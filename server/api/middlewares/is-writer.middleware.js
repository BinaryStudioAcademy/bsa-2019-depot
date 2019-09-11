const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const UserRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const permissionLevel = require('../../helpers/permission.level.helper');
const orgRole = require('../../helpers/role.helper');
const CustomError = require('../../helpers/error.helper');

module.exports = async (req, res, next) => {
  if (req.params.username === req.user.username) {
    return next();
  }

  const { username, reponame } = req.params;
  const userId = req.user.id;

  const repo = req.params.repositoryId
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if (repo && repo.userId === userId) {
    return next();
  }

  const isWriter = await CollaboratorRepository.getCollaboratorWithPermissions({
    userId,
    repositoryId: repo.id,
    name: permissionLevel.write
  });

  const isAdmin = await CollaboratorRepository.getCollaboratorWithPermissions({
    userId,
    repositoryId: repo.id,
    name: permissionLevel.admin
  });

  if (isWriter || isAdmin) {
    return next();
  }

  const { id: orgId } = await UserRepository.getByUsername(username);
  const result = await OrgUserRepository.getUserWithOwnerRole({ userId, orgId });
  let userRole;
  if (result) {
    userRole = result.role.name;
  }
  return userRole === orgRole.owner
    ? next()
    : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
};

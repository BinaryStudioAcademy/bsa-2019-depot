const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const { permissionLevel } = require('../../helpers/permission.level.helper');
const CustomError = require('../../helpers/error.helper');

module.exports = async (req, res, next) => {
  if (req.params.username === req.user.username) {
    return next();
  }

  const { username, reponame } = req.params;

  const repo = req.params.repositoryId
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if (repo.userId === req.user.id) {
    return next();
  }

  const collaborator = await CollaboratorRepository.getCollaboratorWithPermissions({
    userId: req.user.id,
    repositoryId: repo.id,
    name: permissionLevel.admin
  });

  return collaborator
    ? next()
    : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
};

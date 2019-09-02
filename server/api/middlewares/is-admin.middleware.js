const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const { permissionLevel } = require('../../helpers/permission.level.helper');

module.exports = async(req, res, next) => {
  if(req.params.owner === req.user.username) {
    return next();
  };
  const reponame = req.params.repoName || req.params.reponame;
  const username = req.params.owner;
  const repo = req.params.repositoryId || req.params.repoId
    ? await RepositoryRepository.getById(req.params.repositoryId || req.params.repoId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if(repo.userId === req.user.id) {
    return next();
  };

  const collaborator = await CollaboratorRepository.getCollaboratorWithPermissions({
    userId: req.user.id,
    repositoryId: repo.id,
    name: permissionLevel.admin
  });

  return collaborator
    ? next()
    : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
}

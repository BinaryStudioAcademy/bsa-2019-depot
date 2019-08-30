const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const { permissionLevel } = require('../../helpers/permission.level.helper');

module.exports = async(req, res, next) => {
  const name = req.params.repoName || req.params.reponame;
  const username = req.params.owner;
  const repo = req.params.repositoryId 
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, name);

  const collaborator = await CollaboratorRepository.getCollaboratorWithPermissions({ 
    userId: req.user.id, 
    repositoryId: repo.id, 
    name: permissionLevel.admin
  });

  return (username === req.user.username || collaborator)
    ? next() 
    : Promise.reject({
        status: 403,
        message: 'Permission denied'
      });
}

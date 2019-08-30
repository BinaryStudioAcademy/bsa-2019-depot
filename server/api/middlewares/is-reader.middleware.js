const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');

module.exports = async(req, res, next) => {
  const name = req.params.repoName || req.params.reponame;
  const username = req.params.owner;
  const repo = req.params.repositoryId 
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, name);

  return (username === req.user.username || repo.isPublic || Boolean(await CollaboratorRepository.findOne({
    where: {
      userId: req.user.id,
      repositoryId: repo.id,
      deletedAt: null
    }
  }))) 
  ? next() 
  : Promise.reject({
      status: 403,
      message: 'Permission denied'
    });
}
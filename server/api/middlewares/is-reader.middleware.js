const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');

module.exports = async (req, res, next) => {
  if(req.params.owner === req.user.username) {
    next();
    return;
  };
  const reponame = req.params.repoName || req.params.reponame;
  const username = req.params.owner;
  const repo = req.params.repositoryId 
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if(repo.userId === req.user.id) {
    next();
    return;
  };

  const collaborator = await CollaboratorRepository.findOne({
    where: {
      userId: req.user.id,
      repositoryId: repo.id,
      deletedAt: null
    }
  });
  
  return (repo.isPublic || Boolean(collaborator)) 
    ? next() 
    : res.redirect(`${process.env.CLIENT_HOST}/login`)
}
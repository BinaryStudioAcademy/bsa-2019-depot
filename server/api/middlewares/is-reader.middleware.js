const RepositoryRepository = require('../../data/repositories/repository.repository');
const CollaboratorRepository = require('../../data/repositories/collaborator.repository');
const { getOrganizationOwner } = require('../services/organization.service');
const CustomError = require('../../helpers/error.helper');

module.exports = async (req, res, next) => {
  if (req.params.username === req.user.username) {
    return next();
  }

  const { username, reponame } = req.params;

  const repo = req.params.repositoryId
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if (repo.userId === req.user.id || repo.isPublic) {
    return next();
  }

  const { user: { id: orgId } } = await RepositoryRepository.getRepoOwnerByRepoId(repo.id);
  const owners = await getOrganizationOwner(orgId);
  const owner = owners.filter(({ username }) => username === req.user.username);
  if (owner.length) {
    return next();
  }

  if (req.params.repositoryId) {
    const { user: { id: orgId } } = await RepositoryRepository.getRepoOwnerByRepoId(req.params.repositoryId);
    const owners = await getOrganizationOwner(orgId);
    const owner = owners.filter(({ username }) => username === req.user.username);
    if (owner.length) {
      return next();
    }
  }

  const collaborator = await CollaboratorRepository.findOne({
    where: {
      userId: req.user.id,
      repositoryId: repo.id,
      deletedAt: null
    }
  });

  return collaborator
    ? next()
    : next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
};

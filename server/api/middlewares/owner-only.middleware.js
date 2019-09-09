const RepositoryRepository = require('../../data/repositories/repository.repository');
const UserRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const CustomError = require('../../helpers/error.helper');

module.exports = async (req, res, next) => {
  const username = req.params.owner || req.params.username;
  if (username === req.user.username) {
    return next();
  }
  const { reponame } = req.params;
  const repo = req.params.repositoryId
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, reponame);

  if (repo && req.user.id === repo.userId) {
    return next();
  }

  const org = username
    ? await UserRepository.findOne({
      where: {
        username,
        type: 'ORG'
      }
    })
    : await UserRepository.findOne({
      where: {
        id: req.params.userId,
        type: 'ORG'
      }
    });

  if (org) {
    const orgUser = OrgUserRepository.getUserWithOwnerRole({
      userId: req.user.id,
      orgId: org.id
    });
    if (orgUser) {
      return next();
    }
  }

  return next(new CustomError(403, `User ${req.user.username} doesn't have permission to access this page`));
};

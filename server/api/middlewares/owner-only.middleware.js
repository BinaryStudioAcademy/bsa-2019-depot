const RepositoryRepository = require('../../data/repositories/repository.repository');
const UserRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');

module.exports = async(req, res, next) => {
  const name = req.params.repoName || req.params.reponame;
  const username = req.params.owner;
  const repo = req.params.repositoryId 
    ? await RepositoryRepository.getById(req.params.repositoryId)
    : await RepositoryRepository.getByUsernameAndReponame(username, name);

  if (req.user.id === repo.userId) {
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
      })

  const orgUser = OrgUserRepository.getUserWithOwnerRole({ 
    userId: req.user.id,
    orgId: org.id,
  })
  
  return orgUser
    ? next() 
    : Promise.reject({
        status: 403,
        message: 'Permission denied'
      });
};

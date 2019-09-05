const pinnedReposRepository = require('../../data/repositories/pinned-repository.repository');
const repositoryRepository = require('../../data/repositories/repository.repository');

const getPinnedRepos = async userId => pinnedReposRepository.getAll(userId);

const REPOS_LIMIT = 6;
const IS_OWNER = true;

const setPinnedRepos = async (userId, repositories) => {
  try {
    await pinnedReposRepository.deleteByUserId(userId);

    if (!repositories.length) {
      const repos = await repositoryRepository.getByUserWithOptions(userId, IS_OWNER, { limit: REPOS_LIMIT });
      return repos;
    }

    const promises = repositories.map(repositoryId => pinnedReposRepository.create({ userId, repositoryId }));
    const pinnedRepos = await Promise.all(promises).then(array => array.map(item => item.get({ plain: true })));

    return pinnedRepos;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPinnedRepos,
  setPinnedRepos
};

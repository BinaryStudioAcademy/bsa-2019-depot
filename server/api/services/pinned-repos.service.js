const pinnedReposRepository = require('../../data/repositories/pinned-repository.repository');
const repositoryRepository = require('../../data/repositories/repository.repository');

const LIMIT = 6;

const getPinnedRepos = async (userId, isOwner) => {
  try {
    const pinnedRepos = await pinnedReposRepository.getAll(userId);
    if (!pinnedRepos || !pinnedRepos.length) {
      const popularRepos = await repositoryRepository.getByUserWithOptions(userId, isOwner, { limit: LIMIT });
      return { popularRepos };
    }
    return { pinnedRepos };
  } catch (error) {
    throw error;
  }
};

const setPinnedRepos = async (userId, repositories) => {
  try {
    await pinnedReposRepository.deleteByUserId(userId);
    const promises = repositories.map(repositoryId => pinnedReposRepository.create({ userId, repositoryId }));
    return Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPinnedRepos,
  setPinnedRepos
};

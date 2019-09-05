const pinnedReposRepository = require('../../data/repositories/pinned-repository.repository');

const getPinnedRepos = async userId => pinnedReposRepository.getAll(userId);

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

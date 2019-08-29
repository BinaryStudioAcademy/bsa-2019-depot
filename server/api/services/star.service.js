const starRepository = require('../../data/repositories/star.repository');

const getStargazers = repositoryId => starRepository.getStarsByRepositoryId(repositoryId);

const deleteStarsByRepoId = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);
  if (star) {
    const starId = star.get({ plain: true }).id;
    starRepository.deleteById(starId);
  }
};

module.exports = {
  deleteStarsByRepoId,
  getStargazers
};

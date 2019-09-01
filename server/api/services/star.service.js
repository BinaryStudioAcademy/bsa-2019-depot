const starRepository = require('../../data/repositories/star.repository');

const deleteStarsByRepoId = async (userId, repositoryId) => {
  const star = await starRepository.getStar(userId, repositoryId);
  if (star) {
    const starId = star.get({ plain: true }).id;
    starRepository.deleteById(starId);
  }
};

module.exports = {
  deleteStarsByRepoId
};

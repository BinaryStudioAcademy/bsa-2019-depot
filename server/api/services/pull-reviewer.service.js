const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const reviewStatusRepository = require('../../data/repositories/review-status.repository');
const userRepository = require('../../data/repositories/user.repository');

const getReviewersForPull = pullId => pullReviewerRepository.getReviewersForPull(pullId);

const addReviewer = async (pullId, userId) => {
  const { id: statusId } = await reviewStatusRepository.getStatusByName('PENDING');
  const newPullReviewer = (await pullReviewerRepository.create({ userId, pullId, statusId })).get({ plain: true });
  const user = await userRepository.getUserById(userId);
  return { ...newPullReviewer, user };
};

const updateReviewStatus = (reviewerId, newStatus) => pullReviewerRepository.updateById(reviewerId, newStatus);

const removeReviewer = reviewerId => pullReviewerRepository.deleteById(reviewerId);

module.exports = {
  getReviewersForPull,
  addReviewer,
  updateReviewStatus,
  removeReviewer
};

const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const reviewStatusRepository = require('../../data/repositories/review-status.repository');

const getReviewersForPull = pullId => pullReviewerRepository.getReviewersForPull(pullId);

const addReviewer = async (pullId, userId) => {
  const { id: statusId } = await reviewStatusRepository.getStatusByName('PENDING');
  return pullReviewerRepository.create({ userId, pullId, statusId });
};

const updateReviewStatus = (reviewerId, newStatus) => pullReviewerRepository.updateById(reviewerId, newStatus);

const removeReviewer = reviewerId => pullReviewerRepository.deleteById(reviewerId);

module.exports = {
  getReviewersForPull,
  addReviewer,
  updateReviewStatus,
  removeReviewer
};

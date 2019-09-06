const pullRepository = require('../../data/repositories/pull-request.repository');
const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const reviewStatusRepository = require('../../data/repositories/review-status.repository');
const userRepository = require('../../data/repositories/user.repository');
const { sendReviewAssignmentEmail } = require('./email.service');
const { clientUrl } = require('../../config/common.config');

const getReviewersForPull = pullId => pullReviewerRepository.getReviewersForPull(pullId);

const addReviewer = async (pullId, userId) => {
  const { id: statusId } = await reviewStatusRepository.getStatusByName('PENDING');
  const {
    repository: { name: reponame, user: { username: repoOwner } },
    title,
    number
  } = await pullRepository.getPullById(pullId);
  const newPullReviewer = (await pullReviewerRepository.create({ userId, pullId, statusId })).get({ plain: true });
  const user = await userRepository.getUserById(userId);

  await sendReviewAssignmentEmail({
    email: user.email,
    url: clientUrl,
    repoOwner,
    reponame,
    pullNumber: number,
    pullTitle: title
  });

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

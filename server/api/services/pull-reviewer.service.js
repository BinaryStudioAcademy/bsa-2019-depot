const repoRepository = require('../../data/repositories/repository.repository');
const pullRepository = require('../../data/repositories/pull-request.repository');
const collaboratorRepository = require('../../data/repositories/collaborator.repository');
const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const reviewStatusRepository = require('../../data/repositories/review-status.repository');
const userRepository = require('../../data/repositories/user.repository');
const { sendReviewAssignmentEmail } = require('./email.service');
const { clientUrl } = require('../../config/common.config');

const getReviewersForPull = pullId => pullReviewerRepository.getReviewersForPull(pullId);

const getAvailableReviewers = async (repositoryId) => {
  const { userId: repoOwnerId } = await repoRepository.getById(repositoryId);
  const reviewers = (await collaboratorRepository.getCollaboratorsByRepositoryId(repositoryId))
    .filter(reviewer => reviewer.isActivated);

  const repoOwner = await userRepository.getById(repoOwnerId);
  return [...reviewers, { userId: repoOwner.id, user: repoOwner }].sort((user1, user2) => user1.user.username > user2.user.username);
};

const addReviewer = async (pullId, userId) => {
  const status = await reviewStatusRepository.getStatusByName('PENDING');
  const {
    repository: {
      name: reponame,
      user: { username: repoOwner }
    },
    title,
    number
  } = await pullRepository.getPullById(pullId);
  const newPullReviewer = (await pullReviewerRepository.create({ userId, pullId, statusId: status.id })).get({
    plain: true
  });
  const user = await userRepository.getUserById(userId);

  await sendReviewAssignmentEmail({
    email: user.email,
    url: clientUrl,
    repoOwner,
    reponame,
    pullNumber: number,
    pullTitle: title
  });

  return { ...newPullReviewer, user, status };
};

const updateReviewStatus = async (userId, pullId, newStatus) => {
  const { id: statusId } = await reviewStatusRepository.getStatusByName(newStatus);
  return pullReviewerRepository.updateByUserAndPull(userId, pullId, { statusId });
};

const removeReviewer = reviewerId => pullReviewerRepository.deleteById(reviewerId);

module.exports = {
  getReviewersForPull,
  addReviewer,
  updateReviewStatus,
  removeReviewer,
  getAvailableReviewers
};

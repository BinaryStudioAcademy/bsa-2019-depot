const pullCommentRepository = require('../../data/repositories/pull-comment.repository');
const pullReviewerRepository = require('../../data/repositories/pull-reviewer.repository');
const reviewStatusRepository = require('../../data/repositories/review-status.repository');
const CustomError = require('../../helpers/error.helper');

const getAuthorId = id => pullCommentRepository.getAuthorId(id);

const getAllPullComments = pullId => pullCommentRepository.getPullComments(pullId);

const addPullComment = async (pullCommentData) => {
  const { userId, pullId } = pullCommentData;

  const reviewer = await pullReviewerRepository.getByUserAndPull(userId, pullId);
  if (reviewer && reviewer.status.name === 'PENDING') {
    const { id: statusId } = await reviewStatusRepository.getStatusByName('COMMENTED');
    await pullReviewerRepository.updateByUserAndPull(userId, pullId, { statusId });
  }

  return pullCommentRepository.addPullComment(pullCommentData);
};

const updatePullCommentById = async (id, userId, issueCommentData) => {
  const authorId = await getAuthorId(id);

  if (userId !== authorId) {
    throw new CustomError(401, 'Only comment author can update it');
  }

  return pullCommentRepository.updatePullCommentById(id, issueCommentData);
};

const getPullCommentById = id => pullCommentRepository.getById(id);

const deletePullCommentById = async (id, userId) => {
  const authorId = await getAuthorId(id);

  if (userId !== authorId) {
    throw new CustomError(401, 'Only comment author can delete it');
  }

  return pullCommentRepository.deleteById(id);
};

module.exports = {
  getAllPullComments,
  addPullComment,
  updatePullCommentById,
  deletePullCommentById,
  getPullCommentById,
  getAuthorId
};

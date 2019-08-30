const issueCommentRepository = require('../../data/repositories/issue-comment.repository');

const getAuthorId = id => issueCommentRepository.getAuthorId(id);

const getAllIssueComments = issueId => issueCommentRepository.getAllIssueComments(issueId);

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = async (id, userId, issueCommentData) => {
  const authorId = await getAuthorId(id);

  if (userId !== authorId) {
    const err = { status: 401, message: 'Only comment author can update it' };
    throw err;
  }

  return issueCommentRepository.updateIssueCommentById(id, issueCommentData);
};

const getIssueCommentById = id => issueCommentRepository.getById(id);

const deleteIssueCommentById = async (id, userId) => {
  const authorId = await getAuthorId(id);

  if (userId !== authorId) {
    const err = { status: 401, message: 'Only comment author can delete it' };
    throw err;
  }

  return issueCommentRepository.deleteIssueCommentById(id);
};

module.exports = {
  getAllIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById,
  getIssueCommentById,
  getAuthorId
};

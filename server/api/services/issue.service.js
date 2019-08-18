const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({id, ...issueData}) => issueRepository.updateIssueById(id, {issueData});

const getIssueComments = issueId => issueRepository.getIssueComments(issueId);

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = ({id, ...issueCommentData}) => issueCommentRepository.updateIssueCommentById(id, {issueCommentData});

const deleteIssueCommentById = issueCommentId => issueCommentRepository.deleteIssueCommentById(issueCommentId);

module.exports = {
  addIssue,
  updateIssueById,
  getIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById
};

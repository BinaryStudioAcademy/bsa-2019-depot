const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, { issueData });

const getAllRepoIssues = repoId => issueRepository.getRepositoryIssues(repoId);

const getAllIssueComments = issueId => issueCommentRepository.getAllIssueComments(issueId);

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = ({ id, ...issueCommentData }) => issueCommentRepository.updateIssueCommentById(id, { issueCommentData });

const deleteIssueCommentById = issueCommentId => issueCommentRepository.deleteIssueCommentById(issueCommentId);

module.exports = {
  addIssue,
  updateIssueById,
  getAllRepoIssues,
  getAllIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById
};

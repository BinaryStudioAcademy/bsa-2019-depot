const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, issueData);

const getAllRepoIssues = repositoryId => issueRepository.getRepositoryIssues(repositoryId);

const getIssueById = id => issueRepository.getIssueById(id);

const getAuthorId = issueId => issueRepository.getAuthorId(issueId);

const getRepoOwnerId = issueId => issueRepository.getRepoOwnerId(issueId);

const deleteIssueById = id => issueRepository.deleteById(id);

const closeIssueById = id => issueRepository.setIsOpenedById(id, false);

const reopenIssueById = id => issueRepository.setIsOpenedById(id, true);

const getAllIssueComments = issueId => issueCommentRepository.getAllIssueComments(issueId);

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = ({ id, ...issueCommentData }) => issueCommentRepository.updateIssueCommentById(id, { issueCommentData });

const deleteIssueCommentById = issueCommentId => issueCommentRepository.deleteIssueCommentById(issueCommentId);

module.exports = {
  addIssue,
  updateIssueById,
  getAllRepoIssues,
  getIssueById,
  getAuthorId,
  getRepoOwnerId,
  deleteIssueById,
  closeIssueById,
  reopenIssueById,
  getAllIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById
};

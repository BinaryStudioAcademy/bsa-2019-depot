const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, { issueData });

const getAllIssues = (userId, isOpened) => issueRepository.getAllIssues(userId, isOpened);

const getAllIssuesCount = (userId, isOpened) => issueRepository.getAllIssuesCount(userId, isOpened);

const getAllRepoIssues = repositoryId => issueRepository.getRepositoryIssues(repositoryId);

const getRepoIssueByNumber = request => issueRepository.getRepoIssueByNumber(request);

const getAllIssueComments = issueId => issueCommentRepository.getAllIssueComments(issueId);

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = ({ id, ...issueCommentData }) => issueCommentRepository.updateIssueCommentById(id, { issueCommentData });

const deleteIssueCommentById = issueCommentId => issueCommentRepository.deleteIssueCommentById(issueCommentId);

module.exports = {
  addIssue,
  updateIssueById,
  getAllIssues,
  getAllIssuesCount,
  getAllRepoIssues,
  getRepoIssueByNumber,
  getAllIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById
};

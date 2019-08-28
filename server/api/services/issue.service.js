const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');
const CustomError = require('../../helpers/error.helper');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, { issueData });

const getAllRepoIssues = async (repositoryId) => {
  const issues = await issueRepository.getRepositoryIssues(repositoryId);
  return issues || Promise.reject(new CustomError(404, `Repository with id ${repositoryId} not found`));
};

const getRepoIssueByNumber = async (request) => {
  const repoIssue = await issueRepository.getRepoIssueByNumber(request);
  return repoIssue || Promise.reject(new CustomError(404, `Issue number ${request.number} not found`));
};

const getAllIssueComments = async (issueId) => {
  const issueComments = await issueCommentRepository.getAllIssueComments(issueId);
  return issueComments || Promise.reject(new CustomError(404, `Issue number ${issueId} not found`));
};

const addIssueComment = issueCommentData => issueCommentRepository.addIssueComment(issueCommentData);

const updateIssueCommentById = ({ id, ...issueCommentData }) => issueCommentRepository.updateIssueCommentById(id, { issueCommentData });

const deleteIssueCommentById = issueCommentId => issueCommentRepository.deleteIssueCommentById(issueCommentId);

module.exports = {
  addIssue,
  updateIssueById,
  getAllRepoIssues,
  getRepoIssueByNumber,
  getAllIssueComments,
  addIssueComment,
  updateIssueCommentById,
  deleteIssueCommentById
};

const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');
const CustomError = require('../../helpers/error.helper');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, issueData);

const getAllRepoIssues = async (repositoryId) => {
  const issues = await issueRepository.getRepositoryIssues(repositoryId);
  return issues || Promise.reject(new CustomError(404, `Repository with id ${repositoryId} not found`));
};

const getRepoIssues = (repositoryId, sort, author, title) => issueRepository.getIssues(repositoryId, sort, author, title);
const getRepoIssueByNumber = async (request) => {
  const repoIssue = await issueRepository.getRepoIssueByNumber(request);
  return repoIssue || Promise.reject(new CustomError(404, `Issue number ${request.number} not found`));
};

const getIssueById = id => issueRepository.getIssueById(id);
const getAllIssueComments = async (issueId) => {
  const issueComments = await issueCommentRepository.getAllIssueComments(issueId);
  return issueComments || Promise.reject(new CustomError(404, `Issue number ${issueId} not found`));
};

const getAuthorId = issueId => issueRepository.getAuthorId(issueId);

const getRepoOwnerId = issueId => issueRepository.getRepoOwnerId(issueId);

const deleteIssueById = id => issueRepository.deleteById(id);

const closeIssueById = id => issueRepository.setIsOpenedById(id, false);

const reopenIssueById = id => issueRepository.setIsOpenedById(id, true);

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
  getRepoIssues
};

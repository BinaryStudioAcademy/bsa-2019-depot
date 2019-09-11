const issueRepository = require('../../data/repositories/issue.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');
const CustomError = require('../../helpers/error.helper');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, issueData);

const getAllIssues = (userId, params) => issueRepository.getAllIssues(userId, params);

const getAllIssuesCount = (userId, params) => issueRepository.getAllIssuesCount(userId, params);

const getAllIssuesOwners = userId => issueRepository.getAllIssuesOwners(userId);

const getAllRepoIssues = async (repositoryId) => {
  const issues = await issueRepository.getRepositoryIssues(repositoryId);
  return issues || Promise.reject(new CustomError(404, `Repository with id ${repositoryId} not found`));
};

const getRepoIssues = (repositoryId, sort, author, assignee, title, isOpened) => issueRepository.getIssues(repositoryId, sort, author, assignee, title, isOpened);

const getRepoIssueByIdNumber = (repositoryId, number) => issueRepository.getIssueByIdNumber(repositoryId, number);

const getRepoIssueByNumber = async (username, reponame, number) => {
  const repoIssue = await issueRepository.getRepoIssueByNumber(username, reponame, number);
  return repoIssue || Promise.reject(new CustomError(404, `Issue number ${number} not found`));
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

const getRepoByIssueId = id => issueRepository.getRepoByIssueId(id);

const getIssueCount = (repositoryId, isOpened) => issueRepository.getIssueCount(repositoryId, isOpened);

module.exports = {
  addIssue,
  updateIssueById,
  getAllIssues,
  getAllIssuesCount,
  getAllIssuesOwners,
  getAllRepoIssues,
  getIssueById,
  getAuthorId,
  getRepoOwnerId,
  deleteIssueById,
  closeIssueById,
  reopenIssueById,
  getRepoIssues,
  getRepoIssueByNumber,
  getAllIssueComments,
  getRepoIssueByIdNumber,
  getRepoByIssueId,
  getIssueCount
};

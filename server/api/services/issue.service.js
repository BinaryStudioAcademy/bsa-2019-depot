const issueRepository = require('../../data/repositories/issue.repository');
const repoRepository = require('../../data/repositories/repository.repository');
const userRepository = require('../../data/repositories/user.repository');
const issueCommentRepository = require('../../data/repositories/issue-comment.repository');
const issueLabelService = require('../services/issue-label.service');
const CustomError = require('../../helpers/error.helper');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, issueData);

const getAllIssues = (userId, params) => issueRepository.getAllIssues(userId, params);

const getAllIssuesCount = (userId, params) => issueRepository.getAllIssuesCount(userId, params);

const getAllIssuesOwners = userId => issueRepository.getAllIssuesOwners(userId);

const getAllRepoIssues = async (username, reponame) => {
  const user = await userRepository.getByUsername(username);
  if (!user) {
    return Promise.reject(new CustomError(404, `User ${username} not found`));
  }
  const repository = await repoRepository.getByUserAndReponame(user.id, reponame);
  if (!repository) {
    return Promise.reject(new CustomError(404, `Repository ${reponame} for user ${username} not found`));
  }
  const { id } = repository;
  const issues = await issueRepository.getRepositoryIssues({ repositoryId: id });
  return issues || Promise.reject(new CustomError(404, `Issues for repository with id ${id} not found`));
};

const getRepoIssues = (repositoryId, sort, author, title) => issueRepository.getIssues(repositoryId, sort, author, title);

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

const setIssueLabels = async (newLabelIds, issueId) => {
  const issueLabelIds = (await issueLabelService.getLabelsByIssueId(issueId)).map(issueLabel => issueLabel.id) || [];
  const deleteLabelIds = issueLabelIds.filter(issueLabelId => !newLabelIds.includes(issueLabelId));
  deleteLabelIds.forEach(labelId => issueLabelService.deleteByIssueAndLabelId(issueId, labelId));
  const addLabelIds = newLabelIds.filter(labelId => !issueLabelIds.includes(labelId));
  addLabelIds.forEach(labelId => issueLabelService.addIssueLabel(issueId, labelId));
};

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
  getIssueCount,
  setIssueLabels
};

const issueRepository = require('../../data/repositories/issue.repository');

const addIssue = issueData => issueRepository.addIssue(issueData);

const updateIssueById = ({ id, ...issueData }) => issueRepository.updateIssueById(id, issueData);

const getAllRepoIssues = repositoryId => issueRepository.getRepositoryIssues(repositoryId);

const getRepoIssues = (repositoryId, sort, author, title) => issueRepository.getIssues(repositoryId, sort, author, title);

const getIssueById = id => issueRepository.getIssueById(id);

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

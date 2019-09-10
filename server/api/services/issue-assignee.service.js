const IssueAssigneeRepository = require('../../data/repositories/issue-assignee.repository');
const IssueRepository = require('../../data/repositories/issue.repository');
const UserRepository = require('../../data/repositories/user.repository');
const CustomError = require('../../helpers/error.helper');
const { getAvailableAssigneesByRepoId } = require('../services/repo.service');

const getAvailableAssigneesByIssueId = async (issueId) => {
  const issue = await IssueRepository.getById(issueId);
  if (!issue) {
    Promise.reject(new CustomError(400, `Issue ${issueId} is not found`));
  }
  const { repositoryId } = issue;
  return getAvailableAssigneesByRepoId(repositoryId);
};

const getIssueAssigneeById = async (id) => {
  const issueAssignee = await IssueAssigneeRepository.getById(id);
  return issueAssignee || Promise.reject(new CustomError(404, `Issue assignee with id ${id} is not found`));
};

const addIssueAssignee = async (issueId, assigneeId) => {
  const issue = await IssueRepository.getById(issueId);
  if (!issue) {
    return Promise.reject(new CustomError(400, `Issue ${issueId} does not exist`));
  }
  const user = await UserRepository.getById(assigneeId);
  if (!user) {
    return Promise.reject(new CustomError(400, `Assigned user ${assigneeId} does not exist`));
  }
  return IssueAssigneeRepository.addIssueAssignee(issueId, assigneeId);
};

const getAssigneesByIssueId = issueId => IssueAssigneeRepository.getByIssueId(issueId);

const deleteIssueAssigneeById = id => IssueAssigneeRepository.deleteIssueAssigneeById(id);

const deleteByIssueAndAssigneeId = async (issueId, assigneeId) => {
  const issueAssignee = await IssueAssigneeRepository.getByIssueIdAndAssigneeId(issueId, assigneeId);
  if (!issueAssignee) {
    return Promise.reject(
      new CustomError(400, `Association of issue ${issueId} and assignee ${assigneeId} does not exist`)
    );
  }
  return IssueAssigneeRepository.deleteByIssueAndAssigneeId(issueId, assigneeId);
};

const setIssueAssignees = async (assignees, issueId) => {
  const assigneeIds = (await UserRepository.getUsersByUsernames(assignees)).map(user => user.id);
  const issueAssignees = await getAssigneesByIssueId(issueId);
  const issueAssigneeIds = issueAssignees && issueAssignees.length ? issueAssignees.map(issueAssignee => issueAssignee.assigneeId) : [];
  const deleteIds = issueAssignees
    .filter(issueAssignee => !assigneeIds.includes(issueAssignee.assigneeId))
    .map(issueAssignee => issueAssignee.id);
  await IssueAssigneeRepository.bulkDelete(deleteIds);
  const addAssignees = assigneeIds
    .filter(assigneeId => !issueAssigneeIds.includes(assigneeId))
    .map(assigneeId => ({
      issueId,
      assigneeId
    }));
  await IssueAssigneeRepository.bulkCreate(addAssignees);
  return IssueAssigneeRepository.getByIssueId(issueId);
};

module.exports = {
  getIssueAssigneeById,
  addIssueAssignee,
  getAssigneesByIssueId,
  deleteIssueAssigneeById,
  deleteByIssueAndAssigneeId,
  setIssueAssignees,
  getAvailableAssigneesByIssueId
};

const IssueLabelRepository = require('../../data/repositories/issue-label.repository');
const IssueRepository = require('../../data/repositories/issue.repository');
const LabelRepository = require('../../data/repositories/label.repository');
const CustomError = require('../../helpers/error.helper');

const getIssueLabelById = async (id) => {
  const issueLabel = await IssueLabelRepository.getById(id);
  return issueLabel || Promise.reject(new CustomError(404, `Issue label with id ${id} not found`));
};

const addIssueLabel = async (issueId, labelId) => {
  const issue = await IssueRepository.getById(issueId);
  if (!issue) {
    // return 400 in this method since this request is used only by API and is not an actual route
    return Promise.reject(new CustomError(400, `Issue ${issueId} does not exist`));
  }
  const label = await LabelRepository.getById(labelId);
  if (!label) {
    return Promise.reject(new CustomError(400, `Label ${labelId} does not exist`));
  }
  if (label.repositoryId !== issue.repositoryId) {
    return Promise.reject(
      new CustomError(400, `Issue ${issueId} and label ${labelId} do not belong to the same repository`)
    );
  }
  return IssueLabelRepository.addIssueLabel(issueId, labelId);
};

const getLabelsByIssueId = issueId => IssueLabelRepository.getByIssueId(issueId);

const deleteIssueLabelById = id => IssueLabelRepository.deleteIssueLabelById(id);

const deleteByIssueAndLabelId = async (issueId, labelId) => {
  const issueLabel = await IssueLabelRepository.getByIssueIdAndLabelId(issueId, labelId);
  if (!issueLabel) {
    // return 400 in this method since this request is used only by API and is not an actual route
    return Promise.reject(new CustomError(400, `Association of issue ${issueId} and label ${labelId} does not exist`));
  }
  return IssueLabelRepository.deleteByIssueAndLabelId(issueId, labelId);
};

const setIssueLabels = async (labelIds, issueId) => {
  const issueLabels = await getLabelsByIssueId(issueId);
  const issueLabelIds = issueLabels && issueLabels.length ? issueLabels.map(issueLabel => issueLabel.labelId) : [];
  const deleteIssueLabelIds = issueLabels
    .filter(issueLabel => !labelIds.includes(issueLabel.labelId))
    .map(issueLabel => issueLabel.id);
  await IssueLabelRepository.bulkDelete(deleteIssueLabelIds);
  const addIssueLabels = labelIds
    .filter(labelId => !issueLabelIds.includes(labelId))
    .map(labelId => ({
      issueId,
      labelId
    }));
  await IssueLabelRepository.bulkCreate(addIssueLabels);
  return IssueLabelRepository.getByIssueId(issueId);
};

module.exports = {
  getIssueLabelById,
  addIssueLabel,
  deleteIssueLabelById,
  deleteByIssueAndLabelId,
  getLabelsByIssueId,
  setIssueLabels
};

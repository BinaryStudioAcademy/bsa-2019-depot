const IssueLabelRepository = require('../../data/repositories/issue-label.repository');
const IssueRepository = require('../../data/repositories/issue.repository');
const LabelRepository = require('../../data/repositories/label.repository');
const CustomError = require('../../helpers/error.helper');

const getIssueLabelById = async (id) => {
  const issueLabel = await IssueLabelRepository.getById(id);
  return issueLabel || Promise.reject(new CustomError(404, `Issue label with id ${id} not found`));
};

const addIssueLabel = async (issueLabelData) => {
  const { issueId, labelId } = issueLabelData;
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
  return IssueLabelRepository.addIssueLabel(issueLabelData);
};

const deleteIssueLabelById = id => IssueLabelRepository.deleteIssueLabelById(id);

module.exports = {
  getIssueLabelById,
  addIssueLabel,
  deleteIssueLabelById
};

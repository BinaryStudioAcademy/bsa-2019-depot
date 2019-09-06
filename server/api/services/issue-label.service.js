const IssueLabelRepository = require('../../data/repositories/issue-label.repository');
const CustomError = require('../../helpers/error.helper');

const getIssueLabelById = async (id) => {
  const issueLabel = await IssueLabelRepository.getById(id);
  return issueLabel || Promise.reject(new CustomError(404, `Issue label with id ${id} not found`));
};

const addIssueLabel = issueLabelData => IssueLabelRepository.addIssueLabel(issueLabelData);

const deleteIssueLabelById = id => IssueLabelRepository.deleteIssueLabelById(id);

module.exports = {
  getIssueLabelById,
  addIssueLabel,
  deleteIssueLabelById
};

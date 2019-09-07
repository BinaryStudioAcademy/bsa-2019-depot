const LabelRepository = require('../../data/repositories/label.repository');
const RepoRepository = require('../../data/repositories/repository.repository');
const PullLabelRepository = require('../../data/repositories/pull-label.repository');
const CustomError = require('../../helpers/error.helper');

const getLabelById = async (id) => {
  const label = await LabelRepository.getById(id);
  return label || Promise.reject(new CustomError(404, `Label with id ${id} not found`));
};

const getLabelsByRepoId = async (repositoryId) => {
  const repo = await RepoRepository.getById(repositoryId);
  if (!repo) {
    return Promise.reject(new CustomError(404, `Repository with id ${repositoryId} not found`));
  }
  return LabelRepository.getLabelsByRepositoryId(repositoryId);
};

const createLabel = async (labelData) => {
  const { repositoryId, name } = labelData;
  const label = await LabelRepository.getLabelByRepositoryIdAndName(repositoryId, name);
  if (label) {
    return Promise.reject(new CustomError(400, `Label with name ${name} already exists`));
  }
  const { description, color } = labelData;
  return LabelRepository.addLabel({
    repositoryId,
    name,
    description,
    color
  });
};

const updateLabelById = (id, labelData) => LabelRepository.updateLabelById(id, labelData);

const deleteLabelById = async (id) => {
  await PullLabelRepository.deleteByLabelId(id);
  return LabelRepository.deleteLabelById(id);
};

module.exports = {
  getLabelById,
  getLabelsByRepoId,
  createLabel,
  updateLabelById,
  deleteLabelById
};

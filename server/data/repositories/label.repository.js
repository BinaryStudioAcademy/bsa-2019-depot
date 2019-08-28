const BaseRepository = require('./base.repository');
const { LabelModel } = require('../models/index');

class LabelRepository extends BaseRepository {
  getLabelByName(name) {
    return this.model.findOne({ where: { name } });
  }

  getLabelsByRepositoryId(repositoryId) {
    return this.model.findAll({ where: { repositoryId } });
  }

  getLabelById(id) {
    return this.findById(id);
  }

  addLabel({ ...labelData }) {
    return this.create(labelData);
  }

  updateLabelById(id, { ...labelData }) {
    return this.updateById(id, labelData);
  }

  deleteLabelById(id) {
    return this.deleteById(id);
  }
}

module.exports = new LabelRepository(LabelModel);

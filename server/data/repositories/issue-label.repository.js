const BaseRepository = require('./base.repository');
const { IssueLabelModel } = require('../models/index');

class IssueLabelRepository extends BaseRepository {
  getById(id) {
    return this.findById(id);
  }

  addIssueLabel({ ...issueLabelData }) {
    return this.create(issueLabelData);
  }

  deleteIssueLabelById(id) {
    return this.deleteById(id);
  }
}

module.exports = new IssueLabelRepository(IssueLabelModel);

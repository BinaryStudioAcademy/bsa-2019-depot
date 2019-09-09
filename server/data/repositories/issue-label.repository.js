const BaseRepository = require('./base.repository');
const { IssueLabelModel } = require('../models/index');

class IssueLabelRepository extends BaseRepository {
  getById(id) {
    return this.findById(id);
  }

  getByIssueIdAndLabelId(issueId, labelId) {
    return this.model.findOne({
      where: {
        issueId,
        labelId
      }
    });
  }

  getByIssueId(issueId) {
    return this.model.findAll({
      where: {
        issueId
      }
    });
  }

  addIssueLabel(issueId, labelId) {
    return this.create({ issueId, labelId });
  }

  deleteIssueLabelById(id) {
    return this.deleteById(id);
  }

  deleteByIssueAndLabelId(issueId, labelId) {
    return this.model.destroy({
      where: { labelId, issueId }
    });
  }
}

module.exports = new IssueLabelRepository(IssueLabelModel);

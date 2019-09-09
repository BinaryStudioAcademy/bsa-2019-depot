const BaseRepository = require('./base.repository');
const { PullLabelModel } = require('../models/index');

class PullLabelRepository extends BaseRepository {
  getLabelsByPR(pullId) {
    return this.model.findAll({
      where: {
        pullId
      }
    });
  }

  deleteLabelById(id) {
    return this.deleteById(id);
  }

  deleteByLabelId(labelId) {
    return this.model.destroy({
      where: { labelId }
    });
  }

  deleteByLabelAndPullId(labelId, pullId) {
    return this.model.destroy({
      where: { labelId, pullId }
    });
  }
}

module.exports = new PullLabelRepository(PullLabelModel);

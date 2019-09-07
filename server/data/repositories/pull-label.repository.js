const BaseRepository = require('./base.repository');
const { PullLabelModel } = require('../models/index');

class PullLabelRepository extends BaseRepository {
  deleteLabelById(id) {
    return this.deleteById(id);
  }

  deleteByLabelId(labelId) {
    return this.model.destroy({
      where: { labelId }
    });
  }
}

module.exports = new PullLabelRepository(PullLabelModel);

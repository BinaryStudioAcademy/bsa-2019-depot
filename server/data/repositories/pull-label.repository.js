const BaseRepository = require('./base.repository');
const { PullLabelModel } = require('../models/index');

class PullLabelRepository extends BaseRepository {
  async delete(id) {
    const result = await this.model.findOne({ where: { id } });
    this.deleteById(id);
    return result;
  }
}

module.exports = new PullLabelRepository(PullLabelModel);

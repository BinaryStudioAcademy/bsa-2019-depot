const BaseRepository = require('./base.repository');
const { ReviewStatusModel } = require('../models/index');

class ReviewStatusRepository extends BaseRepository {
  getStatusByName(name) {
    return this.model.findOne({ where: { name } });
  }
}

module.exports = new ReviewStatusRepository(ReviewStatusModel);

const BaseRepository = require('./base.repository');
const { StarModel } = require('../models/index');

class StarRepository extends BaseRepository {
  getStar(userId, repositoryId) {
    return this.model.findOne({
      where: { userId, repositoryId },
      attributes: ['id', 'userId', 'repositoryId']
    });
  }
}

module.exports = new StarRepository(StarModel);

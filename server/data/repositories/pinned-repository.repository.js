const BaseRepository = require('./base.repository');
const { PinnedRepositoryModel } = require('../models/index');

class PinnedRepository extends BaseRepository {
  getPinnedRepositories(userId) {
    return this.model.findAll({ where: { userId } });
  }

  deleteByUserId(userId) {
    return this.model.destroy({
      where: { userId }
    });
  }
}

module.exports = new PinnedRepository(PinnedRepositoryModel);

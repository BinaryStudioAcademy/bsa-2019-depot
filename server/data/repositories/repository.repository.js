const BaseRepository = require('./base.repository');
const { RepositoryModel } = require('../models/index');

class RepositoryRepository extends BaseRepository {
  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }

  addRepository({ ...repositoryData }) {
    return this.create(repositoryData);
  }
}

module.exports = new RepositoryRepository(RepositoryModel);

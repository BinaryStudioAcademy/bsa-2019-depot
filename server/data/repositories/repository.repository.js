const BaseRepository = require('./base.repository');
const { RepositoryModel } = require('../models/index');

class RepositoryRepository extends BaseRepository {
  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }

  getCurrentRepoId({userId, name}) {
    return this.model.findOne({ where: { userId, name } });
  }

  addRepository({ ...repositoryData }) {
    return this.create(repositoryData);
  }

  getRepositoryIssues(repoId) {
    return this.model.findAll({ where: { 
      "$issues.repositoryId$": `${repoId}`
    }});
  }
}

module.exports = new RepositoryRepository(RepositoryModel);

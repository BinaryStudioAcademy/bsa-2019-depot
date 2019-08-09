const BaseRepository = require('./base.repository');
const { RepositoryModel } = require('../models/index');

class RepoRepository extends BaseRepository {

  getSettings({ ownerID, repoName }) {
    return this.model.findOne({ where: { ownerID, name: repoName } });
  }

  async renameRepo({ ownerID, repoName, newName }) {
    const repository = await this.model.findOne({ where: { ownerID, name: repoName } });
    return this.model.update({
      name: newName,
      url: repository.url.replace(repoName, newName)
    }, {
      where: { id: repository.id }
    });
  }

  async changePrivacy({ ownerID, repoName }) {
    const repository = await this.model.findOne({ where: { ownerID, name: repoName } });
    return this.model.update({
      isPublic: !repository.isPublic,
    }, {
      where: { id: repository.id }
    });
  }

  async delete({ ownerID, repoName }) {
    const repository = await this.model.findOne({ where: { ownerID, name: repoName } });
    return this.deleteById(repository.id);
  }
}

module.exports = new RepoRepository(RepositoryModel);

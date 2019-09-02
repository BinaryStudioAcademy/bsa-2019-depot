const BaseRepository = require('./base.repository');
const { CommitModel, RepositoryModel } = require('../models/index');

class CommitRepository extends BaseRepository {
  add({ ...commitData }) {
    return this.create(commitData);
  }

  updateById(id, { ...commitData }) {
    return this.updateById(id, commitData);
  }

  getById(id) {
    return this.model.findOne({ where: { id } });
  }

  getByHash(hash) {
    return this.model.findOne({ where: { sha: hash } });
  }

  deleteByRepoId(repositoryId) {
    return this.model.destroy({ where: { repositoryId } });
  }

  getRepoByCommitId(id) {
    return this.model.findOne({
      where: { id },
      include: [
        {
          model: RepositoryModel,
          attributes: ['id']
        }
      ]
    });
  }
}

module.exports = new CommitRepository(CommitModel);

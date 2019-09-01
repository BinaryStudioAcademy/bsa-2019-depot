const BaseRepository = require('./base.repository');
const { CommitModel, UserModel, CommitCommentModel } = require('../models/index');

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
    return this.model.findOne({
      where: { sha: hash },
      include: [UserModel, CommitCommentModel]
    });
  }

  deleteByRepoId(repositoryId) {
    return this.model.destroy({ where: { repositoryId } });
  }
}

module.exports = new CommitRepository(CommitModel);

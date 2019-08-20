const BaseRepository = require('./base.repository');
const { CommitModel } = require('../models/index');

class CommitRepository extends BaseRepository {
  addCommit({ ...commitData }) {
    return this.create(commitData);
  }

  // updateCommitById(id, { ...commitData }) {
  //   return this.updateById(id, commitData);
  // }

  getById(id) {
    return this.model.findOne({ where: { id } });
  }

  getByHash(hash) {
    return this.model.findOne({ where: { sha: hash } });
  }
}

module.exports = new CommitRepository(CommitModel);

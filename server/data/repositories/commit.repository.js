const BaseRepository = require('./base.repository');
const { CommitModel } = require('../models/index');

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

  getBySha(sha) {
    return this.model.findOne({ where: { sha } });
  }
}

module.exports = new CommitRepository(CommitModel);

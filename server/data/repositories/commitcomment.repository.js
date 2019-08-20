const BaseRepository = require('./base.repository');
const { CommitCommentModel } = require('../models/index');

class CommitRepository extends BaseRepository {
  add({ ...commitCommentData }) {
    return this.create(commitCommentData);
  }

  updateById(id, { ...commitCommentData }) {
    return this.updateById(id, commitCommentData);
  }

  getById(id) {
    return this.model.findOne({ where: { id } });
  }

  getByCommitId(commitId) {
    return this.model.findAll({ where: { commitId } });
  }
}

module.exports = new CommitRepository(CommitCommentModel);

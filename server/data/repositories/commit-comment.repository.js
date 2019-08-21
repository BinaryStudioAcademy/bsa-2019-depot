const BaseRepository = require('./base.repository');
const { CommitCommentModel } = require('../models/index');

class CommitCommentRepository extends BaseRepository {
  add({ ...commitCommentData }) {
    return this.create(commitCommentData);
  }

  updateCommentById(id, { ...commitCommentData }) {
    return this.updateById(id, commitCommentData);
  }

  getById(id) {
    return this.model.findOne({ where: { id } });
  }

  getByCommitId(commitId) {
    return this.model.findAll({ where: { commitId } });
  }
}

module.exports = new CommitCommentRepository(CommitCommentModel);

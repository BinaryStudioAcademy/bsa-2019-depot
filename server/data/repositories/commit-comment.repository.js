const BaseRepository = require('./base.repository');
const { CommitCommentModel } = require('../models/index');

class CommitCommentRepository extends BaseRepository {
  addCommitComment({ ...commitCommentData }) {
    return this.create(commitCommentData);
  }

  updateCommitCommentById(id, { ...commitCommentData }) {
    return this.updateById(id, commitCommentData);
  }

  getCommitCommentById(id) {
    return this.model.findOne({ where: { id } });
  }

  deleteCommitCommentById(id) {
    return this.deleteById(id);
  }

  getByCommitId(commitId) {
    return this.model.findAll({ where: { commitId } });
  }
}

module.exports = new CommitCommentRepository(CommitCommentModel);

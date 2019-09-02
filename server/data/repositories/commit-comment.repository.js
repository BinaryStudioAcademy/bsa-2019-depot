const BaseRepository = require('./base.repository');
const { CommitCommentModel, UserModel } = require('../models/index');

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
    return this.model.findAll({
      where: { commitId },
      include: [UserModel],
      order: [['createdAt', 'ASC']]
    });
  }
}

module.exports = new CommitCommentRepository(CommitCommentModel);

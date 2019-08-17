const BaseRepository = require('./base.repository');
const { IssueCommentModel } = require('../models/index');

class IssueCommentRepository extends BaseRepository {
  addIssueComment({ ...issueCommentData }) {
    return this.create(issueCommentData);
  }

  updateIssueCommentById(id, { ...issueCommentData }) {
    return this.updateById(id, issueCommentData);
  }

  deleteIssueCommentById(id) {
    return this.deleteById(id);
  }
}

module.exports = new IssueCommentRepository(IssueCommentModel);

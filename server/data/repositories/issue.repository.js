const BaseRepository = require('./base.repository');
const { IssueModel } = require('../models/index');

class IssueRepository extends BaseRepository {
  addIssue({ ...issueData }) {
    return this.create(issueData);
  }

  getIssueById(id) {
    return this.model.findOne({ where: { id } });
  }

  updateIssueById(id, { ...issueData }) {
    return this.updateById(id, issueData);
  }
}

module.exports = new IssueRepository(IssueModel);

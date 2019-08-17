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

  getIssueComments(issueId) {
    return this.model.findAll({ where: { 
      "$issueComments.issueId$": `${issueId}` 
    }});
  }
}

module.exports = new IssueRepository(IssueModel);

const BaseRepository = require('./base.repository');
const { IssueAssigneeModel } = require('../models/index');

class IssueAssigneeRepository extends BaseRepository {
  getById(id) {
    return this.findById(id);
  }

  getByIssueIdAndAssigneeId(issueId, assigneeId) {
    return this.model.findOne({
      where: {
        issueId,
        assigneeId
      }
    });
  }

  getByIssueId(issueId) {
    return this.model.findAll({
      where: {
        issueId
      }
    });
  }

  addIssueAssignee(issueId, assigneeId) {
    return this.create({ issueId, assigneeId });
  }

  deleteIssueAssigneeById(id) {
    return this.deleteById(id);
  }

  bulkDelete(issueAssigneeIds) {
    return this.model.destroy({
      where: { id: issueAssigneeIds }
    });
  }
}

module.exports = new IssueAssigneeRepository(IssueAssigneeModel);

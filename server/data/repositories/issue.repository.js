const BaseRepository = require('./base.repository');
const { IssueModel, UserModel } = require('../models/index');

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

  getRepositoryIssues({ repositoryId }) {
    return this.model.findAll({
      where: { repositoryId },
      include: [
        {
          model: UserModel,
          attributes: ['username']
        }
      ]
    });
  }
}

module.exports = new IssueRepository(IssueModel);

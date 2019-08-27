const BaseRepository = require('./base.repository');
const { IssueModel, UserModel, RepositoryModel } = require('../models/index');

class IssueRepository extends BaseRepository {
  async addIssue({ ...issueData }) {
    const { repositoryId } = issueData;
    const number = (await this.getMaxIssueRepoNumber(repositoryId) || 0) + 1;
    const issueDataWithNumber = {
      ...issueData,
      number
    };
    return this.create(issueDataWithNumber);
  }

  getMaxIssueRepoNumber(repositoryId) {
    return this.model.max('number', { where: { repositoryId } });
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

  getRepoIssueByNumber({ username, name, number }) {
    return this.model.findOne({
      where: { number },
      include: [
        {
          model: UserModel,
          attributes: [],
          where: { username }
        },
        {
          model: RepositoryModel,
          attributes: [],
          where: { name }
        },
        {
          model: UserModel,
          attributes: ['username']
        }
      ]
    });
  }
}

module.exports = new IssueRepository(IssueModel);

const sequelize  = require ('../db/connection');
const BaseRepository = require('./base.repository');
const { IssueModel, UserModel, RepositoryModel } = require('../models/index');

class IssueRepository extends BaseRepository {
  async addIssue({ ...issueData }) {
    const { repositoryId } = issueData;
    const number = ((await this.getMaxIssueRepoNumber(repositoryId)) || 0) + 1;
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

  getAllIssues(userId, isOpened) {
    return this.model.findAll({
      where: { userId, isOpened },
      include: [
        {
          model: RepositoryModel,
          attributes: ['name']
        },
        {
          model: UserModel,
          where: {id: userId},
          attributes: ['id', 'username']
        }
      ]
    });
  }
  getAllIssuesCount(userId, isOpened) {
    return this.model.count({
      where: { userId, isOpened },
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

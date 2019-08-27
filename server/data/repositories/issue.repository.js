const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const {
  IssueModel, UserModel, RepositoryModel, IssueCommentModel
} = require('../models/index');
const sequelize = require('../db/connection');

const { Op } = Sequelize;

const parseSortQuery = (sort) => {
  switch (sort) {
  case 'created_asc':
    return [['createdAt', 'ASC']];
  case 'created_desc':
    return [['createdAt', 'DESC']];
  case 'updated_asc':
    return [['updatedAt', 'ASC']];
  case 'updated_desc':
    return [['updatedAt', 'DESC']];
  case 'coments_desc':
    return [[sequelize.literal('commentsCount'), 'DESC']];
  default:
    return [];
  }
};

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

  async getAuthorId(issueId) {
    const issue = await this.getIssueById(issueId);
    const { userId: authorId } = issue.get({ plain: true });
    return authorId;
  }

  async getRepoOwnerId(issueId) {
    const issue = await this.getIssueById(issueId);
    const { repositoryId } = issue.get({ plain: true });
    const repo = await RepositoryModel.findOne({ where: { id: repositoryId } });
    const { userId } = repo.get({ plain: true });
    return userId;
  }

  updateIssueById(id, data) {
    return this.model.update(data, {
      where: { id },
      returning: true,
      plain: true
    });
  }

  setIsOpenedById(id, isOpened) {
    return this.model.update(
      { isOpened },
      {
        where: { id },
        returning: true,
        plain: true
      }
    );
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

  getIssues({
    repositoryId, sort, author, title
  }) {
    //
    return this.model.findAll({
      where: {
        repositoryId,
        ...(title ? { body: { [Op.substring]: title } } : {})
      },

      attributes: {
        include: [
          [
            sequelize.literal(`
          (SELECT COUNT(*)
          FROM "issueComments"
          WHERE "issue"."id" = "issueComments"."issueId"
          AND "issueComments"."deletedAt" IS NULL)`),
            'commentsCount'
          ]
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: [],
          ...(author ? { where: { username: author } } : {})
        }
      ],
      order: parseSortQuery(sort)
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

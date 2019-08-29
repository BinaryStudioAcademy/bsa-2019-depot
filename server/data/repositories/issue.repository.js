const sequelize = require('../db/connection');
const BaseRepository = require('./base.repository');
const {IssueModel, UserModel, RepositoryModel, IssueCommentModel} = require('../models/index');

const mapSort = (sort) => {
  switch (sort) {
    case 'createdAt_DESC':
    case 'createdAt_ASC':
    case 'updatedAt_DESC':
    case 'updatedAt_ASC':
      return sort.split('_');
      break;
    case 'commentCount_DESC':
      return [[sequelize.col('commentCount'), 'DESC']];
      break;
    case 'commentCount_ASC':
      return [[sequelize.col('commentCount'), 'ASC']];
      break;
    default:
      return ['createdAt', 'DESC'];
  }
};

class IssueRepository extends BaseRepository {
  async addIssue({...issueData}) {
    const {repositoryId} = issueData;
    const number = ((await this.getMaxIssueRepoNumber(repositoryId)) || 0) + 1;
    const issueDataWithNumber = {
      ...issueData,
      number
    };
    return this.create(issueDataWithNumber);
  }

  getMaxIssueRepoNumber(repositoryId) {
    return this.model.max('number', {where: {repositoryId}});
  }

  getIssueById(id) {
    return this.model.findOne({where: {id}});
  }

  updateIssueById(id, {...issueData}) {
    return this.updateById(id, issueData);
  }

  getRepositoryIssues({repositoryId}) {
    return this.model.findAll({
      where: {repositoryId},
      include: [
        {
          model: UserModel,
          attributes: ['username']
        }
      ]
    });
  }

  getAllIssues(userId, isOpened, sort) {
    return this.model.findAll({
      where: {userId, isOpened},
      order: [mapSort(sort)],
      attributes: {
        include: [
          [
            sequelize.literal(`
                (SELECT COUNT(*)
                FROM "issueComments"
                WHERE "issueComments"."issueId" = "issue"."id"  
                AND "issueComments"."deletedAt" IS NULL)`
            ),
            'commentCount'
          ]
        ]
      },
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
      where: {userId, isOpened},
    });
  }

  getRepoIssueByNumber({username, name, number}) {
    return this.model.findOne({
      where: {number},
      include: [
        {
          model: UserModel,
          attributes: [],
          where: {username}
        },
        {
          model: RepositoryModel,
          attributes: [],
          where: {name}
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

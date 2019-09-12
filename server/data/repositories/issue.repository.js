const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const {
  IssueModel,
  UserModel,
  RepositoryModel,
  LabelModel,
  IssueLabelModel,
  IssueAssigneeModel,
  OrgUserModel
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
  case 'comments_desc':
    return [[sequelize.literal('"commentCount"'), 'DESC']];
  case 'comments_asc':
    return [[sequelize.literal('"commentCount"'), 'ASC']];
  default:
    return [];
  }
};

const mapSort = (sort) => {
  switch (sort) {
  case 'createdAt_DESC':
  case 'createdAt_ASC':
  case 'updatedAt_DESC':
  case 'updatedAt_ASC':
    return sort.split('_');

  case 'commentCount_DESC':
    return [[sequelize.col('commentCount'), 'DESC']];

  case 'commentCount_ASC':
    return [[sequelize.col('commentCount'), 'ASC']];

  default:
    return ['createdAt', 'DESC'];
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
    return this.model.max('number', {
      where: { repositoryId },
      paranoid: false
    });
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
        },
        {
          model: RepositoryModel,
          attributes: ['name']
        },
        {
          model: IssueLabelModel,
          attributes: ['id'],
          include: {
            model: LabelModel,
            attributes: ['id', 'name', 'color', 'description']
          }
        },
        {
          model: IssueAssigneeModel,
          attributes: ['id'],
          include: {
            model: UserModel,
            as: 'assignee',
            attributes: ['id', 'name', 'username', 'imgUrl']
          }
        }
      ]
    });
  }

  getAllIssues(userId, options = {}) {
    const { isOpened, sort, owner } = options;
    let ownerWhere = {};
    if (owner) {
      ownerWhere = { username: owner.split(',') };
    }
    const findOptions = {
      where: { userId, isOpened },
      attributes: {
        include: [
          [
            sequelize.literal(`
                  (SELECT COUNT(*)
                  FROM "issueComments"
                  WHERE "issueComments"."issueId" = "issue"."id"  
                  AND "issueComments"."deletedAt" IS NULL)::integer`),
            'commentCount'
          ]
        ]
      },
      include: [
        {
          model: RepositoryModel,
          attributes: ['name'],
          required: true,
          include: [
            {
              model: UserModel,
              where: ownerWhere,
              required: true,
              attributes: ['id', 'username', 'imgUrl']
            }
          ]
        },
        {
          model: UserModel,
          where: { id: userId },
          attributes: ['id', 'username']
        },
        {
          model: IssueLabelModel,
          attributes: ['id'],
          include: {
            model: LabelModel,
            attributes: ['id', 'name', 'color', 'description']
          }
        },
        {
          model: IssueAssigneeModel,
          attributes: ['id'],
          include: {
            model: UserModel,
            as: 'assignee',
            attributes: ['id', 'name', 'username', 'imgUrl']
          }
        }
      ]
    };

    if (sort) {
      findOptions.order = [mapSort(sort)];
    }

    return this.model.findAll(findOptions);
  }

  getAllIssuesCount(userId, p) {
    const { isOpened, owner } = p;
    let ownerWhere = {};
    if (owner) {
      ownerWhere = { username: owner.split(',') };
    }
    const findOptions = {
      where: { userId, isOpened },
      include: [
        {
          model: RepositoryModel,
          attributes: [],
          required: true,
          include: [
            {
              model: UserModel,
              where: ownerWhere,
              required: true
            }
          ]
        }
      ]
    };

    return this.model.count(findOptions);
  }

  getAllIssuesOwners(userId) {
    return UserModel.findAll({
      attributes: ['username'],
      include: [
        {
          model: RepositoryModel,
          attributes: [],
          include: [
            {
              attributes: [],
              model: this.model,
              where: { userId }
            }
          ]
        },
        {
          model: OrgUserModel,
          where: { userId }
        }
      ]
    });
  }

  getIssueByIdNumber(repositoryId, number) {
    return this.model.findAll({
      where: {
        repositoryId,
        number
      }
    });
  }

  async getIssues(repositoryId, sort, authorId, assigneeId, title, isOpened = true) {
    const whereTitle = title
      ? sequelize.where(sequelize.fn('lower', sequelize.col('issue.title')), {
        [Op.substring]: title.toLowerCase()
      })
      : {};

    const whereAuthor = authorId ? { userId: authorId } : {};

    const queryObject = {
      where: {
        [Op.and]: [{ repositoryId }, { isOpened }, whereTitle, whereAuthor]
      },
      attributes: {
        include: [
          [
            sequelize.literal(`
          (SELECT COUNT(*)
          FROM "issueComments"
          WHERE "issue"."id" = "issueComments"."issueId"
          AND "issueComments"."deletedAt" IS NULL)`),
            'commentCount'
          ]
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: ['username']
        },
        {
          model: RepositoryModel,
          attributes: ['name'],
          include: [
            {
              model: UserModel,
              attributes: ['username']
            }
          ]
        },
        {
          model: IssueLabelModel,
          attributes: ['id'],
          include: [
            {
              model: LabelModel,
              attributes: ['name', 'description', 'color', 'id']
            }
          ]
        },
        {
          model: IssueAssigneeModel,
          attributes: ['id'],
          include: {
            model: UserModel,
            as: 'assignee',
            attributes: ['id', 'name', 'username', 'imgUrl']
          }
        }
      ],
      order: parseSortQuery(sort)
    };

    if (assigneeId) {
      const issues = await sequelize.query(`(SELECT "issues"."id"
      FROM "issues"
      LEFT JOIN "issueAssignees"
      ON "issueAssignees"."issueId"="issues"."id"
      WHERE "issueAssignees"."assigneeId" = '${assigneeId}'
      AND "issues"."repositoryId" = '${repositoryId}'
      AND "issues"."deletedAt" IS NULL )`);
      if (issues) {
        const issueIds = issues[0].map(issue => issue.id);
        queryObject.where.id = issueIds;
      }
    }

    return this.model.findAll(queryObject);
  }

  getIssueCount(repositoryId, isOpened) {
    return this.model.aggregate('id', 'COUNT', {
      where: {
        repositoryId,
        isOpened
      }
    });
  }

  getRepoIssueByNumber(username, reponame, number) {
    return this.model.findOne({
      where: { number },
      include: [
        {
          model: RepositoryModel,
          attributes: [],
          where: { name: reponame },
          include: [
            {
              model: UserModel,
              attributes: [],
              where: { username }
            }
          ]
        },
        {
          model: UserModel,
          attributes: ['username', 'imgUrl']
        },
        {
          model: IssueLabelModel,
          attributes: ['id'],
          include: {
            model: LabelModel,
            attributes: ['id', 'name', 'color', 'description']
          }
        },
        {
          model: IssueAssigneeModel,
          attributes: ['id'],
          include: {
            model: UserModel,
            as: 'assignee',
            attributes: ['id', 'name', 'username', 'imgUrl']
          }
        }
      ]
    });
  }

  getRepoByIssueId(id) {
    return this.model.findOne({
      where: { id },
      include: [
        {
          model: RepositoryModel,
          attributes: ['id']
        }
      ]
    });
  }
}

module.exports = new IssueRepository(IssueModel);

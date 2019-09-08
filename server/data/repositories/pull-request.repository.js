const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const PRStatusRepository = require('./pr-status.repository');
const {
  PullRequestModel,
  UserModel,
  RepositoryModel,
  PRStatusModel,
  BranchModel,
  PullLabelModel,
  LabelModel
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
    return [[sequelize.literal('"commentsCount"'), 'DESC']];
  case 'comments_asc':
    return [[sequelize.literal('"commentsCount"'), 'ASC']];
  default:
    return [];
  }
};

class PullRepository extends BaseRepository {
  getMaxIssueRepoNumber(repositoryId) {
    return this.model.max('number', {
      where: { repositoryId },
      paranoid: false
    });
  }

  async addPull({ ...pullData }) {
    const { repositoryId } = pullData;
    const number = ((await this.getMaxIssueRepoNumber(repositoryId)) || 0) + 1;
    const status = (await PRStatusRepository.getByName('OPEN')).id;
    const pullDataWithNumber = {
      ...pullData,
      statusId: status,
      number
    };
    return this.create(pullDataWithNumber);
  }

  getRepositoryPulls(repositoryId) {
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
          model: PRStatusModel,
          attributes: ['name']
        },
        {
          model: PullLabelModel,
          include: [
            {
              model: LabelModel,
              where: {
                repositoryId
              }
            }
          ]
        }
      ]
    });
  }

  getRepoPullByNumber(username, reponame, number) {
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
          attributes: ['username']
        },
        {
          model: PRStatusModel,
          attributes: ['name']
        },
        {
          model: BranchModel,
          as: 'fromBranch',
          attributes: ['name']
        },
        {
          model: BranchModel,
          as: 'toBranch',
          attributes: ['name']
        },
        {
          model: PullLabelModel,
          include: [
            {
              model: LabelModel,
              attributes: ['name', 'description', 'color', 'id']
            }
          ]
        }
      ]
    });
  }

  updatePullById(id, data) {
    return this.model.update(data, {
      where: { id },
      returning: true,
      plain: true
    });
  }

  setStatusById(id, statusId) {
    return this.model.update(
      { statusId },
      {
        where: { id },
        returning: true,
        plain: true
      }
    );
  }

  getPullById(id) {
    return this.model.findOne({
      where: { id },
      include: [
        {
          model: RepositoryModel,
          include: [UserModel]
        },
        {
          model: BranchModel,
          as: 'fromBranch',
          attributes: ['name']
        },
        {
          model: BranchModel,
          as: 'toBranch',
          attributes: ['name']
        }
      ]
    });
  }

  async getAuthorId(pullId) {
    const pull = await this.getPullById(pullId);
    const { userId: authorId } = pull.get({ plain: true });
    return authorId;
  }

  async getRepoOwnerId(pullId) {
    const pull = await this.getPullById(pullId);
    const { repositoryId } = pull.get({ plain: true });
    const repo = await RepositoryModel.findOne({ where: { id: repositoryId } });
    const { userId } = repo.get({ plain: true });
    return userId;
  }

  getPulls(repositoryId, sort, authorId, title, isOpened, statusOpenedId) {
    return this.model.findAll({
      where: {
        repositoryId,
        statusId:
          isOpened === 'true'
            ? statusOpenedId
            : {
              [Op.ne]: statusOpenedId
            },
        ...(title ? { title: { [Op.substring]: title } } : {}),
        ...(authorId ? { userId: authorId } : {})
      },
      attributes: {
        include: [
          [
            sequelize.literal(`
          (SELECT COUNT(*)
          FROM "pullComments"
          WHERE "pullrequest"."id" = "pullComments"."pullId"
          AND "pullComments"."deletedAt" IS NULL)`),
            'commentsCount'
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
          include: [UserModel]
        },
        {
          model: PRStatusModel,
          attributes: ['name']
        },
        {
          model: PullLabelModel,
          include: [
            {
              model: LabelModel,
              attributes: ['name', 'description', 'color', 'id']
            }
          ]
        }
      ],
      order: parseSortQuery(sort)
    });
  }

  getPullCount(repositoryId, isOpened, status) {
    const { id: statusId } = status;
    return this.model.aggregate('id', 'COUNT', {
      where: {
        repositoryId,
        statusId: isOpened
          ? statusId
          : {
            [Op.ne]: statusId
          }
      }
    });
  }

  getRepoByPullId(id) {
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

module.exports = new PullRepository(PullRequestModel);

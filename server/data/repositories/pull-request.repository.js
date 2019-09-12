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
  LabelModel,
  PullReviewerModel,
  OrgUserModel
} = require('../models/index');

const sequelize = require('../db/connection');

const { Op } = Sequelize;

const mapSort = (sort) => {
  switch (sort) {
  case 'created_asc':
    return ['createdAt', 'ASC'];

  case 'created_desc':
    return ['createdAt', 'DESC'];

  case 'updated_asc':
    return ['updatedAt', 'ASC'];

  case 'updated_desc':
    return ['updatedAt', 'DESC'];

  case 'commentCount_DESC':
    return [[sequelize.col('commentCount'), 'DESC']];

  case 'commentCount_ASC':
    return [[sequelize.col('commentCount'), 'ASC']];

  default:
    return ['createdAt', 'DESC'];
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
          attributes: ['username', 'imgUrl']
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

  getPulls({
    repositoryId, sort, userId, owner, title, isOpened, statusOpenedId, reviewRequests
  }) {
    const ownerWhere = owner ? { username: owner.split(',') } : {};
    const titleWhere = title
      ? sequelize.where(sequelize.fn('lower', sequelize.col('pullrequest.title')), {
        [Op.substring]: title.toLowerCase()
      })
      : {};
    const repositoryIdWhere = repositoryId ? { repositoryId } : {};
    const statusIdWhere = sequelize.where(
      sequelize.col('pullrequest.statusId'),
      isOpened === 'true' ? { [Op.eq]: statusOpenedId } : { [Op.ne]: statusOpenedId }
    );
    const userIdWhere = userId && reviewRequests !== 'true' ? { userId } : {};

    return this.model.findAll({
      where: {
        [Op.and]: [ownerWhere, titleWhere, statusIdWhere, repositoryIdWhere, userIdWhere]
      },
      attributes: {
        include: [
          [
            sequelize.literal(`
          (SELECT COUNT(*)
          FROM "pullComments"
          WHERE "pullrequest"."id" = "pullComments"."pullId")::integer`),
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
          required: true,
          include: [
            {
              model: UserModel,
              where: ownerWhere,
              required: true
            }
          ]
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
        },
        ...(reviewRequests === 'true'
          ? [
            {
              model: PullReviewerModel,
              where: { userId }
            }
          ]
          : [])
      ],
      order: [mapSort(sort)]
    });
  }

  getPullCount({
    repositoryId, userId, owner, isOpened, statusOpenedId, reviewRequests
  }) {
    const ownerWhere = owner ? { username: owner.split(',') } : {};
    return this.model.count({
      where: {
        ...(repositoryId ? { repositoryId } : {}),
        ...(userId && reviewRequests !== 'true' ? { userId } : {}),
        statusId: isOpened
          ? statusOpenedId
          : {
            [Op.ne]: statusOpenedId
          }
      },
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
        },
        ...(reviewRequests === 'true'
          ? [
            {
              model: PullReviewerModel,
              where: { userId }
            }
          ]
          : [])
      ]
    });
  }

  getAllPullsOwners(userId) {
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

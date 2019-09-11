const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const {
  RepositoryModel,
  UserModel,
  StarModel,
  BranchModel,
  LanguageStatsModel,
  LanguageModel
} = require('../models/index');
const sequelize = require('../db/connection');

class RepositoryRepository extends BaseRepository {
  addRepository({ ...repositoryData }) {
    return this.create(repositoryData);
  }

  getById(repositoryId) {
    return this.model.findOne({
      where: { id: repositoryId },
      include: {
        model: BranchModel,
        as: 'defaultBranch',
        attributes: ['id', 'name']
      }
    });
  }

  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }

  getByUserWithOptions(userId, isOwner, options = {}) {
    const whereStatement = isOwner ? { userId } : { userId, isPublic: true };
    const { filter, limit, sortByCreatedDateDesc } = options;
    const findOptions = {
      where: whereStatement,
      attributes: {
        include: [
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "stars"
            WHERE "repository"."id" = "stars"."repositoryId"
            AND "stars"."deletedAt" IS NULL)`),
            'starsCount'
          ]
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: [],
          where: { id: userId }
        },
        {
          model: StarModel,
          attributes: ['userId']
        },
        {
          model: this.model,
          as: 'originalRepo',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserModel,
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: BranchModel,
          as: 'defaultBranch',
          include: [
            {
              model: LanguageStatsModel,
              include: [LanguageModel],
              order: [['percentage', 'DESC']],
              limit: 1
            }
          ]
        }
      ]
    };

    if (sortByCreatedDateDesc) {
      findOptions.order = [['createdAt', 'DESC']];
    }

    if (limit) {
      findOptions.limit = limit;
    }

    if (filter) {
      findOptions.where = {
        ...findOptions.where,
        name: {
          [Op.substring]: filter
        }
      };
    }
    return this.model.findAll(findOptions);
  }

  getByUserAndReponame(userId, reponame) {
    return this.model.findOne({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('lower', sequelize.col('repository.name')), sequelize.fn('lower', reponame)),
          { userId }
        ]
      },
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)
            FROM "repositories"
            WHERE "repository"."id" = "repositories"."forkedFromRepoId"
            AND "repository"."deletedAt" IS NULL)`),
            'forkedCount'
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "stars"
            WHERE "repository"."id" = "stars"."repositoryId"
            AND "stars"."deletedAt" IS NULL)`),
            'starsCount'
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "issues"
            WHERE "repository"."id" = "issues"."repositoryId"
            AND "issues"."deletedAt" IS NULL)`),
            'issuesCount'
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "pullrequests"
            WHERE "repository"."id" = "pullrequests"."repositoryId"
            AND "pullrequests"."deletedAt" IS NULL)`),
            'pullCount'
          ],
          [
            sequelize.literal(`
            (SELECT COUNT(DISTINCT "commits"."userId")
            FROM "commits"
            INNER JOIN "users"
            ON "users"."id" = "commits"."userId"
            AND "commits"."deletedAt" IS NULL
            AND "commits"."repositoryId" = "repository"."id")`),
            'contributorsCount'
          ]
        ]
      },
      include: [
        {
          model: this.model,
          as: 'originalRepo',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserModel,
              attributes: ['id', 'username']
            }
          ]
        },
        {
          model: BranchModel,
          as: 'defaultBranch',
          attributes: ['id', 'name']
        },
        {
          model: UserModel,
          attributes: ['id', 'username', 'imgUrl']
        },
        {
          model: StarModel,
          include: [UserModel]
        }
      ]
    });
  }

  updateByUserAndReponame(userId, reponame, data) {
    return this.model.update(data, { where: { name: reponame, userId } });
  }

  getByUsernameAndReponame(username, name) {
    return this.model.findOne({
      where: { name },
      include: [
        {
          model: UserModel,
          where: { username },
          attributes: []
        }
      ]
    });
  }

  getRepoOwnerByRepoId(id) {
    return this.model.findOne({
      where: { id },
      include: [
        {
          model: UserModel
        }
      ]
    });
  }

  deleteByUserAndReponame(userId, reponame) {
    return this.model.destroy({ where: { name: reponame, userId } });
  }

  getRepositoryForks(repositoryId) {
    return this.model.findAll({
      where: { forkedFromRepoId: repositoryId },
      required: true,
      include: [
        {
          model: UserModel,
          attributes: ['username', 'imgUrl', 'bio', 'location']
        }
      ]
    });
  }

  getRepositoryById(id) {
    return this.model.findOne({
      where: { id },
      include: [
        {
          model: UserModel,
          attributes: ['username', 'imgUrl']
        }
      ]
    });
  }
}

module.exports = new RepositoryRepository(RepositoryModel);

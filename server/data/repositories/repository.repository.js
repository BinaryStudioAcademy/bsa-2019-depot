const { Op } = require('sequelize');
const BaseRepository = require('./base.repository');
const { RepositoryModel, UserModel, StarModel } = require('../models/index');
const sequelize = require('../db/connection');

class RepositoryRepository extends BaseRepository {
  addRepository({ ...repositoryData }) {
    return this.create(repositoryData);
  }

  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }

  getRepositoryById(id) {
    return this.model.findOne(
      {
        where: { id },
        include: [
          {
            model: UserModel,
            attributes: ['id', 'username']
          }
        ]
      }
    );
  }

  getByUserWithOptions(userId, options = {}) {
    const { filter, limit, sortByCreatedDateDesc } = options;
    const findOptions = {
      where: { userId },
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
      where: { name: reponame, userId },
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)
            FROM "repositories"
            WHERE "repository"."id" = "repositories"."forkedFromRepoId"
            AND "repository"."deletedAt" IS NULL)`),
            'forkedCount'
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
        }
      ]
    });
  }

  updateByUserAndReponame(userId, reponame, data) {
    return this.model.update(data, { where: { name: reponame, userId } });
  }

  deleteByUserAndReponame(userId, reponame) {
    return this.model.destroy({ where: { name: reponame, userId } });
  }
}

module.exports = new RepositoryRepository(RepositoryModel);

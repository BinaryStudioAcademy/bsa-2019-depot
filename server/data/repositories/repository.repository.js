const BaseRepository = require('./base.repository');
const { RepositoryModel, UserModel, StarModel } = require('../models/index');
const sequelize = require('../db/connection');

class RepositoryRepository extends BaseRepository {
  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }

  addRepository({ ...repositoryData }) {
    return this.create(repositoryData);
  }

  getByUsername(username) {
    return this.model.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`
            (SELECT COUNT(*)
            FROM "stars"
            WHERE "repository"."id" = "stars"."repositoryId" AND
            "repositories"."deletedAt" IS NULL)`),
            'starsCount'
          ]
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: [],
          where: { username }
        },
        {
          model: StarModel,
          attributes: ['userId']
        }
      ]
    });
  }

  getByUserAndReponame(userId, reponame) {
    return this.model.findOne({
      where: { name: reponame, userId },
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)
            FROM "repositories" 
            WHERE "repository"."id" = "repositories"."forkedFromRepoId" AND
            "repositories"."deletedAt" IS NULL)`),
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

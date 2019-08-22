const BaseRepository = require('./base.repository');
const { RepositoryModel, UserModel } = require('../models/index');
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
            WHERE "repository"."id" = "stars"."repositoryId")`),
            'starsCount'
          ]
        ]
      },
      include: [
        {
          model: UserModel,
          attributes: [],
          where: { username }
        }
      ]
    });
  }

  getByUserAndReponame(userId, reponame) {
    return this.model.findOne({
      where: { name: reponame, userId },
      group: ['repository.id', 'forkedRepos.id'],
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('forkedRepos.id')), 'forkedCount']]
      },
      include: [
        {
          model: this.model,
          as: 'forkedRepos',
          attributes: [],
          duplicating: false
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

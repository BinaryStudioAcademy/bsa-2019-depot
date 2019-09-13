const BaseRepository = require('./base.repository');
const { RepositoryModel, UserModel, StarModel } = require('../models/index');
const sequelize = require('../db/connection');

class StarRepository extends BaseRepository {
  getStar(userId, repositoryId) {
    return this.model.findOne({
      where: { userId, repositoryId },
      attributes: ['id', 'userId', 'repositoryId']
    });
  }

  getStars(username) {
    return this.model.findAll({
      attributes: [],
      include: [
        {
          model: UserModel,
          attributes: ['id', 'username'],
          where: { username }
        },
        {
          model: RepositoryModel,
          where: { deletedAt: null },
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
          include: {
            model: UserModel,
            attributes: ['username']
          }
        }
      ]
    });
  }

  getStargazers(repositoryId) {
    return this.model.findAll({
      attributes: ['id', 'repositoryId'],
      where: { repositoryId },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'username', 'imgUrl', 'location', 'createdAt']
        }
      ]
    });
  }
}

module.exports = new StarRepository(StarModel);

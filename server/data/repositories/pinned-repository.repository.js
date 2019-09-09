const sequelize = require('../db/connection');
const BaseRepository = require('./base.repository');
const { PinnedRepositoryModel, RepositoryModel, UserModel } = require('../models/index');

class PinnedRepository extends BaseRepository {
  getAll(userId, isOwner) {
    const whereStatement = isOwner ? { deletedAt: null } : { deletedAt: null, isPublic: true };

    return this.model.findAll({
      where: { userId },
      attributes: ['id'],
      include: [
        {
          model: RepositoryModel,
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
          include: {
            model: UserModel,
            attributes: ['username']
          }
        }
      ]
    });
  }

  deleteByUserId(userId) {
    return this.model.destroy({
      where: { userId }
    });
  }
}

module.exports = new PinnedRepository(PinnedRepositoryModel);

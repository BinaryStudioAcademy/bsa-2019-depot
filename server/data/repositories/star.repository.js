const BaseRepository = require('./base.repository');
const { StarModel, RepositoryModel } = require('../models/index');

class StarRepository extends BaseRepository {
  getStar(userId, repositoryId) {
    return this.model.findOne({
      group: ['star.id', 'repository.id'],
      where: { userId, repositoryId },
      include: [
        {
          model: RepositoryModel,
          attributes: ['id', 'userId']
        }
      ]
    });
  }
}

module.exports = new StarRepository(StarModel);

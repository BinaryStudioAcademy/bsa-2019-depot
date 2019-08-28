const BaseRepository = require('./base.repository');
const { CollaboratorModel, PermissionModel } = require('../models/index');

class CollaboratorRepository extends BaseRepository {
  findRepoById(id) {
    return this.model.findAll({
      where: { id }
    });
  }

  getUserRights(userId, repositoryId) {
    return this.model.findAll({
      where: { 
        userId, 
        repositoryId 
      },
      include: [
        {
          model: PermissionModel,
          attributes: ['name']
        }
      ]
    });
  }
}

module.exports = new CollaboratorRepository(CollaboratorModel);

const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const { CollaboratorModel, PermissionModel, UserModel } = require('../models/index');

const Op = Sequelize.Op;

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

  getCollaboratorsByRepositoryId(repositoryId) {
    return this.model.findAll({
      where: { 
        repositoryId,
        deletedAt: {
          [Op.is]: null
        }
      },
      include: [
        {
          model: UserModel,
          attributes: ['username', 'imgUrl']
        }
      ]
    });
  }
}

module.exports = new CollaboratorRepository(CollaboratorModel);

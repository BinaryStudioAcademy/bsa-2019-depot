const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const { CollaboratorModel, PermissionModel, UserModel, RepositoryModel } = require('../models/index');

const Op = Sequelize.Op;

class CollaboratorRepository extends BaseRepository {
  findRepoById(repositoryId) {
    return this.model.findAll({
      where: { 
        repositoryId,
        deletedAt: {
          [Op.is]: null
        }
      }
    });
  };

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
  };

  getCollaboratorsByRepositoryId(repositoryId) {
    return this.model.findAll({
      where: { 
        repositoryId,
        deletedAt: {
          [Op.is]: null
        }
      },
      include: [{
          model: UserModel,
          attributes: ['username', 'imgUrl']
      }]
    });
  };

  getUserInvitationStatus(userId, repositoryId) {
    return this.model.findAll({
      where: { 
        userId,
        repositoryId,
        deletedAt: {
          [Op.is]: null
        }
      }
    });
  };

  getCollaboratorWithPermissions({ userId, repositoryId, name }) {
    return this.model.findOne({
      where: {
        userId,
        repositoryId,
        deletedAt: null
      },
      include: [{
        model: PermissionModel,
        where: { name }
      }]
    });
  };
}

module.exports = new CollaboratorRepository(CollaboratorModel);
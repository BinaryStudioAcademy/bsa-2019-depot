const Sequelize = require('sequelize');
const BaseRepository = require('./base.repository');
const { CollaboratorModel, PermissionModel, UserModel, RepositoryModel } = require('../models/index');

const Op = Sequelize.Op;

class CollaboratorRepository extends BaseRepository {
  findRepoById(id) {
    return this.model.findAll({
      where: { id }
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

  getUserInvitationStatus(username, reponame, userId) {
    return this.model.findAll({
      where: { 
        userId,
        deletedAt: {
          [Op.is]: null
        }
      },
      include: [{
        model: UserModel,
        where: {
          username
        },
      }, {
        model: RepositoryModel,
        where: {
          name: reponame
        }
      }]
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

const BaseRepository = require('./base.repository');
const {
  BranchModel, CommitModel, UserModel, RepositoryModel
} = require('../models/index');
// const sequelize = require('../db/connection');

class BranchRepository extends BaseRepository {
  getByNameAndRepoId(name, repositoryId) {
    return this.model.findOne({
      where: { name, repositoryId },
      attributes: ['id', 'name', 'createdAt'],
      include: [
        {
          model: RepositoryModel,
          attributes: ['id', 'name']
        },
        {
          model: CommitModel,
          as: 'headCommit',
          attributes: ['id', 'message', 'sha', 'createdAt'],
          order: [['createdAt', 'DESC']],
          include: {
            model: UserModel,
            attributes: ['id', 'username']
          }
        }
      ]
    });
  }

  getByRepoId(repositoryId) {
    return this.model.findAll({
      where: { repositoryId },
      include: [
        {
          model: CommitModel,
          as: 'headCommit',
          attributes: ['id', 'message', 'sha', 'createdAt'],
          order: [['createdAt', 'DESC']],
          include: {
            model: UserModel,
            attributes: ['id', 'username']
          }
        }
      ]
    });
  }

  getAllRepoBranches(repositoryId) {
    return this.model.findAll({
      raw: true,
      where: { repositoryId },
      attributes: {
        exclude: ['id']
      }
    });
  }

  deleteByRepoId(repositoryId) {
    return this.model.destroy({ where: { repositoryId } });
  }
}

module.exports = new BranchRepository(BranchModel);

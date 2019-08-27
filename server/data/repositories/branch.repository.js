const BaseRepository = require('./base.repository');
const { BranchModel } = require('../models/index');

class BranchRepository extends BaseRepository {
  getByNameAndRepoId(name, repositoryId) {
    return this.model.findOne({ where: { name, repositoryId } });
  }

  deleteByRepoId(repositoryId) {
    return this.model.destroy({ where: { repositoryId } });
  }
}

module.exports = new BranchRepository(BranchModel);

const BaseRepository = require('./base.repository');
const { BranchModel } = require('../models/index');

class BranchRepository extends BaseRepository {
  getByNameAndRepo(name, repositoryId) {
    return this.model.findOne({ where: { name, repositoryId } });
  }
}

module.exports = new BranchRepository(BranchModel);

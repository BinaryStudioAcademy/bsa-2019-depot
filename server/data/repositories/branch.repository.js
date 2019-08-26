const BaseRepository = require('./base.repository');
const { BranchModel } = require('../models/index');

class BranchRepository extends BaseRepository {
  upsert(data) {
    return this.model.upsert(data);
  }
}

module.exports = new BranchRepository(BranchModel);

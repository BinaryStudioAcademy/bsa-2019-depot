const BaseRepository = require('./base.repository');
const { PRStatusModel } = require('../models/index');

class RoleRepository extends BaseRepository {
  getByName(name) {
    return this.model.findOne({ where: { name } });
  }
}

module.exports = new RoleRepository(PRStatusModel);

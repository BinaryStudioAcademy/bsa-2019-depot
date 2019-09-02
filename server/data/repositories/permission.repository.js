const BaseRepository = require('./base.repository');
const { PermissionModel } = require('../models/index');

class PermissionRepository extends BaseRepository {
  getPermissionByName(name) {
    return this.model.findOne({ where: { name } });
  }
}

module.exports = new PermissionRepository(PermissionModel);

const BaseRepository = require('./base.repository');
const { SshKeyModel } = require('../models/index');

class SshKeyRepository extends BaseRepository {
  getByUser(userId) {
    return this.model.findAll({ where: { userId } });
  }
}

module.exports = new SshKeyRepository(SshKeyModel);

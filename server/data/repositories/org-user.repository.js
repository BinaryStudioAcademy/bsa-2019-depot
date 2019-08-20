const BaseRepository = require('./base.repository');
const { OrgUserModel } = require('../models/index');

class OrgUserRepository extends BaseRepository {
  findUserInOrg(userId, orgId) {
    return this.model.findOne({ where: { userId, orgId } });
  }
}

module.exports = new OrgUserRepository(OrgUserModel);

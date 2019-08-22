const BaseRepository = require('./base.repository');
const { OrgUserModel } = require('../models/index');

class OrgUserRepository extends BaseRepository {
  findUserInOrg(userId, orgId) {
    return this.model.findOne({ where: { userId, orgId } });
  }

  getAllOrganizationUsers(orgId) {
    return this.model.findAll({ where: { orgId } });
  }
}

module.exports = new OrgUserRepository(OrgUserModel);

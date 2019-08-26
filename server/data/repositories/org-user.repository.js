const BaseRepository = require('./base.repository');
const { OrgUserModel, UserModel, RoleModel } = require('../models/index');

class OrgUserRepository extends BaseRepository {
  findUserInOrg(userId, orgId) {
    return this.model.findOne({ where: { userId, orgId } });
  }

  getAllOrganizationUsers(orgId) {
    return this.model.findAll({ where: { orgId } });
  }

  getUsersOrganizations(userId) {
    return this.model.findAll({
      where: { userId },
      include: [
        {
          model: UserModel
        },
        {
          model: RoleModel
        }
      ]
    });
  }
}

module.exports = new OrgUserRepository(OrgUserModel);

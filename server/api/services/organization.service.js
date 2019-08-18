const userRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const RoleRepository = require('../../data/repositories/role.repository');

const createOrganization = async (data) => {
  const { username, userID } = data;
  const found = await userRepository.getByUsername(username);

  if (found) {
    return { status: false, error: 'such profile name already exists' };
  }

  const {
    dataValues: { id: ownerRoleId }
  } = await RoleRepository.getByName('OWNER');
  const profile = await userRepository.addUser({ ...data, type: 'ORG', fake: false });
  const orgUser = await OrgUserRepository.create({ roleId: ownerRoleId, userId: userID, orgId: profile.id });

  return {
    orgUser,
    profile,
    status: true
  };
};

module.exports = {
  createOrganization
};

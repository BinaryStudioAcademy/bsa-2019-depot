const userRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');

const createOrganization = async (data) => {
  const { username, userID } = data;
  const found = await userRepository.getByUsername(username);
  const ownerID = 1;

  if (found) {
    return { status: false, error: 'such profile name already exists' };
  }

  return {
    org_user: await OrgUserRepository.create({ roleId: ownerID, userId: userID, orgId: userID }),
    profile: await userRepository.addUser({ ...data, type: 'ORG', fake: false }),
    status: true
  };
};

module.exports = {
  createOrganization
};

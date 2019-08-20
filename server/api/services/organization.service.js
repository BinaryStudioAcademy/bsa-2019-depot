const userRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const RoleRepository = require('../../data/repositories/role.repository');

const { sendInviteEmail } = require('./email.service');

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
  const orgUser = await OrgUserRepository.create({
    roleId: ownerRoleId, userId: userID, orgId: profile.id, isActivated: true
  });

  return {
    orgUser,
    profile,
    status: true
  };
};

const addMember = async (data) => {
  const {
    orgName, username, role, url
  } = data;

  const {
    dataValues: { id: roleId }
  } = await RoleRepository.getByName(role);

  const user = await userRepository.getByUsername(username);
  if (!user) {
    return { status: false, error: 'Such user does not exist' };
  }

  const { id: userId, email } = user;
  await sendInviteEmail({
    email, url, orgName, username
  });

  const { id: orgId } = await userRepository.getByUsername(orgName);
  await OrgUserRepository.create({
    roleId, userId, orgId, isActivated: false
  });
  return {
    status: true
  };
};

const checkInvite = async (data) => {
  const { orgName, userId } = data;

  const { id: orgId } = await userRepository.getByUsername(orgName);
  const result = await OrgUserRepository.findUserInOrg(userId, orgId);

  return {
    result,
    status: true
  };
};

const acceptInvitation = async (data) => {
  const { orgName, userId } = data;

  const { id: orgId } = await userRepository.getByUsername(orgName);
  const { id } = await OrgUserRepository.findUserInOrg(userId, orgId);
  await OrgUserRepository.updateById(id, {
    isActivated: true
  });

  return {
    status: true
  };
};

const cancelInvitation = async (data) => {
  const { orgName, userId } = data;

  const { id: orgId } = await userRepository.getByUsername(orgName);
  const { id } = await OrgUserRepository.findUserInOrg(userId, orgId);

  await OrgUserRepository.deleteById(id);

  return {
    status: true
  };
};

module.exports = {
  createOrganization,
  addMember,
  checkInvite,
  acceptInvitation,
  cancelInvitation
};

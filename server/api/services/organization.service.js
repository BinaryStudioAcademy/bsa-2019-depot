const userRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const RoleRepository = require('../../data/repositories/role.repository');

const { sendInviteEmail } = require('./email.service');

const getOrganizationMembers = async orgId => OrgUserRepository.getAllOrganizationUsers(orgId);

const getOrganizationOwner = async (orgId) => {
  const ownerRole = await RoleRepository.getByName('OWNER');
  const ownerRoleId = ownerRole.get({ plain: true }).id;
  const orgMembers = await getOrganizationMembers(orgId);
  console.log(orgMembers);
  const owner = orgMembers.filter(member => member.roleId === ownerRoleId);
  const ownerId = owner[0].get({ plain: true }).userId;
  return { ownerId };
};

const createOrganization = async (data) => {
  const { username, userID } = data;
  const found = await userRepository.getByUsername(username);

  if (found) {
    return { status: false, error: 'such profile name already exists' };
  }

  const { id: roleId } = (await RoleRepository.getByName('OWNER')).get({ plain: true });
  const profile = await userRepository.addUser({ ...data, type: 'ORG', fake: false });
  const { id: orgId } = profile;
  const orgUser = await OrgUserRepository.create({
    roleId,
    userId: userID,
    orgId,
    isActivated: true
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

  const { id: roleId } = (await RoleRepository.getByName(role)).get({ plain: true });

  const user = await userRepository.getByUsername(username);
  if (!user) {
    return { status: false, error: 'Such user does not exist' };
  }

  const { id: userId, email } = user;
  await sendInviteEmail({
    email,
    url,
    orgName,
    username
  });

  const { id: orgId } = await userRepository.getByUsername(orgName);
  await OrgUserRepository.create({
    roleId,
    userId,
    orgId,
    isActivated: false
  });
  return {
    status: true
  };
};

const getRelationUserOrg = async (data) => {
  const { orgname, userID } = data;

  const org = await userRepository.getByUsername(orgname);
  if (!org) {
    return {
      result: false,
      status: true
    };
  }
  const { id: orgId } = org;
  const result = await OrgUserRepository.findUserInOrg(userID, orgId);
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
  getRelationUserOrg,
  acceptInvitation,
  cancelInvitation,
  getOrganizationMembers,
  getOrganizationOwner
};

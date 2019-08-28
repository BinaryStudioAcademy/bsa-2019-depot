const userRepository = require('../../data/repositories/user.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');
const RoleRepository = require('../../data/repositories/role.repository');

const { sendInviteEmail } = require('./email.service');
const CustomError = require('../../helpers/error.helper');

const getOrganizationMembers = async (orgId) => {
  const orgUsers = await OrgUserRepository.getAllOrganizationUsers(orgId);
  const userPromises = orgUsers.map((orgUser) => {
    const { userId } = orgUser.get({ plain: true });
    return userRepository.getUserById(userId);
  });
  const users = await Promise.all(userPromises);
  const rolePromises = orgUsers.map((orgUser) => {
    const { roleId } = orgUser.get({ plain: true });
    return RoleRepository.getRoleById(roleId);
  });
  const roles = await Promise.all(rolePromises);
  const members = users.map((user, index) => ({
    ...user.dataValues,
    role: roles[index].name
  }));
  return members;
};

const getOrganizationOwner = async (orgId) => {
  const orgMembers = await getOrganizationMembers(orgId);
  const owners = orgMembers.filter(member => member.role === 'OWNER');
  return owners;
};

const createOrganization = async (data) => {
  const { username, userID } = data;
  const found = await userRepository.getByUsername(username);

  if (found) {
    return Promise.reject(new CustomError(400, `Organization ${username} already exists`));
  }

  const { id: roleId } = (await RoleRepository.getByName('OWNER')).get({ plain: true });
  const profile = await userRepository.addUser({ ...data, type: 'ORG' });
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
    return Promise.reject(new CustomError(404, `User ${username} not found`));
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
    return Promise.reject(new CustomError(404, `Organization ${org} not found`));
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

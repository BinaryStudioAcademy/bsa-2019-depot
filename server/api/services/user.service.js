const UserRepository = require('../../data/repositories/user.repository');
const StarRepository = require('../../data/repositories/star.repository');
const OrgUserRepository = require('../../data/repositories/org-user.repository');

const tokenHelper = require('../../helpers/token.helper');

const getUserById = userId => UserRepository.getUserById(userId);

const getUsersOrganizations = userId => OrgUserRepository.getUsersOrganizations(userId);

const getUserDetailed = async (username) => {
  const user = await UserRepository.getUserDetailed(username);
  if (!user) {
    const errorObj = { status: 404, message: `User ${username} not found` };
    return Promise.reject(errorObj);
  }
  return user;
};

const setUsername = async ({ id, username }) => {
  const data = await UserRepository.setUsernameById(id, username);
  return {
    ...data
  };
};

const checkUsernameExists = async ({ username }) => {
  const user = await UserRepository.getByUsername(username);
  return {
    usernameExists: Boolean(user)
  };
};

const resetPassword = async ({ token, password }) => {
  const result = { status: 200, message: 'Password updated' };
  const authorizedData = await tokenHelper.verifyToken(token);
  if (!authorizedData) {
    const errorObj = { status: 401, message: 'Incorrect token' };
    return Promise.reject(errorObj);
  }
  await UserRepository.setUserPassword(authorizedData.data, password);
  return result;
};

const updateUserSettings = async ({ id, settings }) => {
  const {
    name, bio, url, company, location, imgUrl
  } = settings;
  const data = await UserRepository.updateUserById(id, {
    name,
    bio,
    url,
    company,
    location,
    imgUrl
  });
  return {
    ...data
  };
};

const getStars = async username => StarRepository.getStars(username);

const getUsersToInviting = async ({ orgID, username }) => {
  const allUsers = await UserRepository.findUserByLetter(username);
  const orgUsers = await OrgUserRepository.getAllOrganizationUsers(orgID);
  const usersIdInOrg = orgUsers.map(({ userId }) => userId);

  const users = allUsers.filter(({ id }) => !usersIdInOrg.includes(id)).slice(0, 6);
  const usernames = users.map(user => user.username);
  return usernames;
};

module.exports = {
  getUserById,
  setUsername,
  checkUsernameExists,
  updateUserSettings,
  resetPassword,
  getUserDetailed,
  getStars,
  getUsersToInviting,
  getUsersOrganizations
};

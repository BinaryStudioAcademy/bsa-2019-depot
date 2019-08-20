const UserRepository = require('../../data/repositories/user.repository');

const tokenHelper = require('../../helpers/token.helper');

const getUserById = userId => UserRepository.getUserById(userId);

const getUserDetailed = username => UserRepository.getUserDetailed(username);

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

module.exports = {
  getUserById,
  setUsername,
  checkUsernameExists,
  updateUserSettings,
  resetPassword,
  getUserDetailed
};

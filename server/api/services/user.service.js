const userRepository = require('../../data/repositories/user.repository');

const getUserById = userId => userRepository.getUserById(userId);

const setUsername = async ({ id, username }) => {
  const data = await userRepository.setUsernameById(id, username);
  return {
    ...data
  };
};

const checkUsernameExists = async ({ username }) => {
  const user = await userRepository.getByUsername(username);
  return {
    usernameExists: Boolean(user)
  };
};

module.exports = {
  getUserById,
  setUsername,
  checkUsernameExists
};

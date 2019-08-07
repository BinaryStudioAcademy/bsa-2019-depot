const UserRepository = require('../../data/repositories/user.repository');

const setUsername = async ({ id, username }) => {
  const data = UserRepository.setUsernameById(id, username);
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

const checkEmailExists = async ({ email }) => {
  const user = await UserRepository.getByEmail(email);
  return {
    emailExists: Boolean(user)
  };
};

module.exports = {
  setUsername,
  checkUsernameExists,
  checkEmailExists
};

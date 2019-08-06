const UserRepository = require('../../data/repositories/user.repository');
const tokenHelper = require('../../helpers/token.helper');

const setUsername = async ({ jwt, username }) => {
  const { id } = tokenHelper.decode(jwt);
  const data = UserRepository.setUsernameById(id, username);
  return {
    ...data
  };
};

const getUsername = async ({ username }) => {
  const user = await UserRepository.getByUsername(username);
  return {
    usernameExists: !!user
  };
};

module.exports = {
  setUsername,
  getUsername
};

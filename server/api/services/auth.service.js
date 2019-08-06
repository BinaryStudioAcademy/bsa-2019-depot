const UserRepository = require('../../data/repositories/user.repository');

const login = async ({ id }) => ({
  user: await UserRepository.getUserById(id)
});

const register = async (userData) => {
  const newUser = await UserRepository.addUser({
    ...userData
  });
  return login(newUser);
};

module.exports = { login, register };

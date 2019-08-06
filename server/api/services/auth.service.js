const UserRepository = require('../../data/repositories/user.repository');
const tokenHelper = require('../../helpers/token.helper');

const login = async ({ id, email }) => ({
  token: tokenHelper.createToken({ id, email })
});

const googleLogin = async ({ id, email, username }) => {
  const usernameExists = !!username;
  const jwt = tokenHelper.createToken({ id, email });

  const data = {
    usernameExists,
    jwt
  };

  return { ...data };
};

const register = async (userData) => {
  const newUser = await UserRepository.addUser({
    ...userData
  });
  return login(newUser);
};

const setUsername = async ({ id, username }) => {
  const user = await UserRepository.getByUsername(username);
  if (user) {
    return {
      success: false
    };
  }

  const success = UserRepository.setUsernameById(id, username);
  return {
    success
  };
};

module.exports = {
  login,
  register,
  googleLogin,
  setUsername
};

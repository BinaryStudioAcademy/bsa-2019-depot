const userRepository = require('../../data/repositories/user.repository');
const tokenHelper = require('../../helpers/token.helper');

const login = async ({ id, email }) => ({
  user: await userRepository.getById(id),
  token: tokenHelper.createToken({ id, email })
});

const googleLogin = async ({ id, email, username }) => {
  const usernameExists = Boolean(username);
  const jwt = tokenHelper.createToken({ id, email });

  const data = {
    usernameExists,
    jwt
  };

  return { ...data };
};

const register = async userData => {
  const newUser = await userRepository.addUser({
    ...userData
  });
  return login(newUser);
};

module.exports = {
  login,
  register,
  googleLogin
};

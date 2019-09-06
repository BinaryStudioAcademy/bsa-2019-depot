const userRepository = require('../../data/repositories/user.repository');
const tokenHelper = require('../../helpers/token.helper');

const login = async ({ id, email }) => ({
  user: await userRepository.getById(id),
  token: tokenHelper.createToken({ id, email })
});

const googleLogin = async ({ id, email, username }) => {
  const usernameExists = Boolean(username);
  const token = tokenHelper.createToken({ id, email });

  const data = {
    usernameExists,
    token,
    id,
    email,
    username
  };

  return { ...data };
};

const googleLoginMobile = async (email) => {
  let user = await userRepository.getByEmail(email);
  if (!user) {
    user = await userRepository.addUser({ email });
  }
  const { id, username } = user;
  const token = tokenHelper.createToken({ id, email });

  const data = {
    token,
    id,
    email,
    username
  };
  return { ...data };
};

const register = async (userData) => {
  const newUser = await userRepository.addUser({
    ...userData
  });
  return login(newUser);
};

module.exports = {
  login,
  register,
  googleLogin,
  googleLoginMobile
};

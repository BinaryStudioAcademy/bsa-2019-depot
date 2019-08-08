const jwt = require('jsonwebtoken');
const UserRepository = require('../../data/repositories/user.repository');
const { sendTokenEmail } = require('../../helpers/email.helper');

const secret = process.env.SECRET_KEY;

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

const checkEmailExists = async ({ email }) => {
  const user = await UserRepository.getByEmail(email);
  return {
    emailExists: Boolean(user)
  };
};

const sendForgetPasswordEmail = async ({ email }) => {
  const isExist = await checkEmailExists({ email });
  if (!isExist.emailExists) {
    return { failure: 'Email is not exist' };
  }
  const user = await UserRepository.getByEmail(email);
  const token = jwt.sign({ data: user.email }, secret, { expiresIn: '1h' });
  sendTokenEmail(email, token);
  return { success: `Email with password reset link was sent to ${user.email}` };
};

const resetPassword = async ({ token, password }) => {
  let result;
  await jwt.verify(token, secret, async (err, authorizedData) => {
    if (err) {
      result = { failure: 'Incorrect token' };
    } else {
      await UserRepository.setUserPassword(authorizedData.data, password);
      result = { success: 'Password updated' };
    }
  });
  return result;
};

module.exports = {
  setUsername,
  checkUsernameExists,
  checkEmailExists,
  sendForgetPasswordEmail,
  resetPassword
};

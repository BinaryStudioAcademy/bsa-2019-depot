const jwt = require('jsonwebtoken');
const UserRepository = require('../../data/repositories/user.repository');
const { sendTokenEmail } = require('../../helpers/email.helper');
const tokenHelper = require('../../helpers/token.helper');

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
  const token = jwt.sign({ data: user.dataValues.email }, secret, { expiresIn: '1h' });
  sendTokenEmail(email, token);
  return { success: `Email with password reset link was sent to ${user.email}` };
};

const resetPassword = async ({ token, password }) => {
  let result = { success: 'Password updated' };
  const authorizedData = await tokenHelper.verifyToken(token);
  if (!authorizedData) result = { failure: 'Incorrect token' };
  await UserRepository.setUserPassword(authorizedData.data, password);
  return result;
};

module.exports = {
  setUsername,
  checkUsernameExists,
  checkEmailExists,
  sendForgetPasswordEmail,
  resetPassword
};

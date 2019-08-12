const jwt = require('jsonwebtoken');

const UserRepository = require('../../data/repositories/user.repository');
const SshKeyRepository = require('../../data/repositories/sshKey.repository');

const { sendTokenEmail } = require('../../helpers/email.helper');
const tokenHelper = require('../../helpers/token.helper');
const { generateFingerprint } = require('../../helpers/fingerprint.helper');

const secret = process.env.SECRET_KEY;

const getUserById = userId => UserRepository.getUserById(userId);

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

const createKey = async (keyData) => {
  const fingerprint = await generateFingerprint();
  return SshKeyRepository.create({ ...keyData, fingerprint });
};

const getKeysByUser = userId => SshKeyRepository.getByUser(userId);

const deleteKey = keyId => SshKeyRepository.deleteById(keyId);

module.exports = {
  getUserById,
  setUsername,
  checkUsernameExists,
  checkEmailExists,
  sendForgetPasswordEmail,
  updateUserSettings,
  resetPassword,
  createKey,
  getKeysByUser,
  deleteKey
};

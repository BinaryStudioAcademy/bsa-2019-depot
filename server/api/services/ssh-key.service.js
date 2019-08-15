const fs = require('fs');
const SshKeyRepository = require('../../data/repositories/ssh-key.repository');
const { generateFingerprint } = require('../../helpers/fingerprint.helper');

const createKey = async (keyData) => {
  await new Promise((resolve, reject) => {
    fs.appendFile(process.env.SSH_KEYS, keyData.value, 'utf8', (error) => {
      if (error) reject(error);
      resolve();
    });
  });
  const fingerprint = await generateFingerprint();
  return SshKeyRepository.create({ ...keyData, fingerprint });
};

const getKeysByUser = userId => SshKeyRepository.getByUser(userId);

const deleteKey = async (keyId) => {
  const { value: key } = await SshKeyRepository.getById(keyId);
  const authorizedKeys = await new Promise((resolve, reject) => {
    fs.readFile(process.env.SSH_KEYS, 'utf8', (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });

  fs.writeFile(process.env.SSH_KEYS, authorizedKeys.replace(key, ''), 'utf8', (error) => {
    if (error) throw error;
  });

  return SshKeyRepository.deleteById(keyId);
};

module.exports = {
  createKey,
  getKeysByUser,
  deleteKey
};
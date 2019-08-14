const SshKeyRepository = require('../../data/repositories/sshKey.repository');
const { generateFingerprint } = require('../../helpers/fingerprint.helper');

const createKey = async keyData => {
  const fingerprint = await generateFingerprint();
  return SshKeyRepository.create({ ...keyData, fingerprint });
};

const getKeysByUser = userId => SshKeyRepository.getByUser(userId);

const deleteKey = keyId => SshKeyRepository.deleteById(keyId);

module.exports = {
  createKey,
  getKeysByUser,
  deleteKey
};

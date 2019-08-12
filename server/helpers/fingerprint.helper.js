const fs = require('fs');
const fingerprintGenerator = require('ssh-fingerprint');

const generateFingerprint = async () => {
  const publicKey = await fs.readFile(process.env.PUBLIC_KEY_PATH);
  return fingerprintGenerator(publicKey);
};

module.exports = { generateFingerprint };

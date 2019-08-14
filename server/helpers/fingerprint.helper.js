const fs = require('fs');
const fingerprintGenerator = require('ssh-fingerprint');

const generateFingerprint = async () => new Promise((resolve, reject) => {
  fs.readFile(process.env.PUBLIC_KEY_PATH, 'utf8', (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(fingerprintGenerator(data));
    }
  });
});

module.exports = { generateFingerprint };

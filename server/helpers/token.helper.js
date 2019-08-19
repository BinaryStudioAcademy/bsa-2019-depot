const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

const verifyToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, authorizedData) => {
    if (err) {
      reject(err);
    }
    resolve(authorizedData);
  });
});

module.exports = {
  createToken: data => jwt.sign(data, secret, { expiresIn }),
  verifyToken
};

const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

const verifyToken = async (token) => {
  await jwt.verify(token, secret, (err, authorizedData) => {
    if (err) {
      return err;
    }
    return authorizedData;
  });
};

module.exports = {
  createToken: data => jwt.sign(data, secret, { expiresIn }),
  verifyToken
};

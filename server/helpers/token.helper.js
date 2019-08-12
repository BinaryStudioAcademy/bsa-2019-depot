const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

const verifyToken = async token => {
  let result;
  await jwt.verify(token, secret, (err, authorizedData) => {
    if (err) {
      return err;
    }
    result = authorizedData;
    return result;
  });
  return result;
};

module.exports = {
  createToken: data => jwt.sign(data, secret, { expiresIn }),
  verifyToken
};

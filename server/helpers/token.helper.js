const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt.config');

module.exports = {
  createToken: data => jwt.sign(data, secret, { expiresIn }),
  decode: token => jwt.verify(token, secret)
};

const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.SECRET_KEY;
const expiresIn = '24h';

module.exports = {
  secret,
  expiresIn
};

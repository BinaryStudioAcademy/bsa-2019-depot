const bcrypt = require('bcryptjs');

const saltRounds = 10;

module.exports = {
  encrypt: data => bcrypt.hash(data, saltRounds),
  encryptSync: data => bcrypt.hashSync(data, saltRounds),
  compare: (data, encrypted) => bcrypt.compare(data, encrypted)
};

const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');

associate({
  User,
  SshKey
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey
};

const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');

associate({
  User,
  SshKey,
  Repository
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository
};

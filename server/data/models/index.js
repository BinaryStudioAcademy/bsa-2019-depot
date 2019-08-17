const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Commit = orm.import('./commit');

associate({
  User,
  SshKey,
  Repository,
  Commit
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  CommitModel: Commit
};

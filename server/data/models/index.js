const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Commits = orm.import('./commits');

associate({
  User,
  SshKey,
  Repository,
  Commits
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  CommitsModel: Commits
};

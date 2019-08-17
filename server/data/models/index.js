const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Commit = orm.import('./commit');
const CommitComment = orm.import('./commitcomment');

associate({
  User,
  SshKey,
  Repository,
  Commit,
  CommitComment
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  CommitModel: Commit,
  CommitCommentModel: CommitComment
};

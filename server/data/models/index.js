const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Issue = orm.import('./issue');
const IssueComment = orm.import('./issueComment');

associate({
  User,
  SshKey,
  Repository,
  Issue,
  IssueComment
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  IssueModel: Issue,
  IssueCommentModel: IssueComment
};

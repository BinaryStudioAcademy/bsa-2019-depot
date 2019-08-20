const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Commit = orm.import('./commit');
const CommitComment = orm.import('./commitcomment');
const Star = orm.import('./star');
const OrgUser = orm.import('./orgUser');
const Role = orm.import('./role');

associate({
  User,
  SshKey,
  Repository,
  Commit,
  CommitComment,
  Star,
  OrgUser,
  Role
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  CommitModel: Commit,
  CommitCommentModel: CommitComment,
  StarModel: Star,
  OrgUserModel: OrgUser,
  RoleModel: Role
};

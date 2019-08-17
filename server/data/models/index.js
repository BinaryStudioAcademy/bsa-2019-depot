const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const OrgUser = orm.import('./orguser');
const Role = orm.import('./role');

associate({
  User,
  SshKey,
  Repository,
  OrgUser,
  Role
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  OrgUserModel: OrgUser,
  RoleModel: Role
};

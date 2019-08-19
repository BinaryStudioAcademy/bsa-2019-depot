const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const Repository = orm.import('./repository');
const Star = orm.import('./star');
const OrgUser = orm.import('./orgUser');
const Role = orm.import('./role');

associate({
  User,
  SshKey,
  Repository,
  Star,
  OrgUser,
  Role
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  RepositoryModel: Repository,
  StarModel: Star,
  OrgUserModel: OrgUser,
  RoleModel: Role
};

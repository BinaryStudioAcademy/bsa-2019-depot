const orm = require('../db/connection');
const associate = require('../db/associations');

const User = orm.import('./user');
const SshKey = orm.import('./sshkey');
const OrgUser = orm.import('./orguser');

associate({
  User,
  SshKey,
  OrgUser
});

module.exports = {
  UserModel: User,
  SshKeyModel: SshKey,
  OrgUserModel: OrgUser
};

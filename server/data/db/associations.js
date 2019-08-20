module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment, OrgUser, Role
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });

  Repository.belongsTo(User);

  Repository.hasMany(Commit);
  Commit.belongsTo(Repository);

  Commit.hasMany(CommitComment);
  CommitComment.belongsTo(Commit);

  Repository.hasMany(CommitComment);
  CommitComment.belongsTo(Repository);

  User.hasMany(CommitComment);
  CommitComment.belongsTo(User);
  // Repository.hasOne(DefaultBranch);
};

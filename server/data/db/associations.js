module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment, OrgUser, Role
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  Repository.belongsTo(User);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });

  Repository.hasMany(Commit, { foreignKey: 'repoId', onDelete: 'CASCADE' });
  // Commit.belongsTo(Repository);

  Commit.hasMany(CommitComment, { foreignKey: 'commitId', onDelete: 'CASCADE' });
  CommitComment.belongsTo(Commit);

  User.hasMany(CommitComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  CommitComment.belongsTo(User);
  // Repository.hasOne(DefaultBranch);
};

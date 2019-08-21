module.exports = (models) => {
  const {
    User, SshKey, Repository, OrgUser, Role, Issue, IssueComment, Star
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Issue);
  User.hasMany(IssueComment);
  Repository.hasMany(Issue);
  Issue.hasMany(IssueComment);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });
  User.hasMany(Star);

  Repository.belongsTo(User);
  Issue.belongsTo(User);
  Issue.belongsTo(Repository);
  IssueComment.belongsTo(User);
  IssueComment.belongsTo(Issue);
  // Repository.hasOne(DefaultBranch);
  Repository.hasMany(Star);

  Star.belongsTo(Repository);
  Star.belongsTo(User);
};

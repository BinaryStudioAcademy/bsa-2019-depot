module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment, OrgUser, Role, Issue, IssueComment, Star
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Issue);
  User.hasMany(IssueComment);
  Repository.hasMany(Issue, { foreignKey: 'repositoryId' });
  Issue.hasMany(IssueComment);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });
  User.hasMany(Star);

  Repository.hasMany(Commit, { foreignKey: 'repoId' });
  Commit.hasMany(CommitComment, { foreignKey: 'commitId' });
  CommitComment.belongsTo(Commit);

  User.hasMany(CommitComment, { foreignKey: 'userId' });
  CommitComment.belongsTo(User);

  Repository.belongsTo(Repository, {
    foreignKey: 'forkedFromRepoId',
    as: 'originalRepo'
  });
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

module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment, OrgUser, Role, Issue, IssueComment
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Issue);
  User.hasMany(IssueComment);
  Repository.hasMany(Issue);
  Issue.hasMany(IssueComment);
  Repository.belongsTo(User);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });

  Repository.hasMany(Commit, { foreignKey: 'repoId', onDelete: 'CASCADE' });
  Commit.hasMany(CommitComment, { foreignKey: 'commitId', onDelete: 'CASCADE' });
  CommitComment.belongsTo(Commit);

  User.hasMany(CommitComment, { foreignKey: 'userId', onDelete: 'CASCADE' });
  CommitComment.belongsTo(User);

  Repository.belongsTo(Repository, {
    foreignKey: 'forkedFromRepoId',
    as: 'originalRepo'
  });
  Issue.belongsTo(User);
  Issue.belongsTo(Repository);
  IssueComment.belongsTo(User);
  IssueComment.belongsTo(Issue);
};

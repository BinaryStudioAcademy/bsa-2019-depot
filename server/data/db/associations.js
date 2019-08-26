module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment, OrgUser, Role, Issue, IssueComment, Star, Permission, Collaborator
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
  User.hasMany(Collaborator, { foreignKey: 'userId' });

  OrgUser.belongsTo(User, { foreignKey: 'orgId' });
  OrgUser.belongsTo(Role, { foreignKey: 'roleId' });

  Repository.hasMany(Commit, { foreignKey: 'repositoryId' });
  Commit.hasMany(CommitComment, { foreignKey: 'commitId' });
  CommitComment.belongsTo(Commit);

  User.hasMany(CommitComment, { foreignKey: 'userId' });
  CommitComment.belongsTo(User);

  Repository.hasMany(Repository, {
    foreignKey: 'forkedFromRepoId',
    as: 'forkedRepos'
  });
  Repository.belongsTo(Repository, {
    foreignKey: 'forkedFromRepoId',
    as: 'originalRepo'
  });
  Repository.belongsTo(User);
  Repository.hasMany(Collaborator, { foreignKey: 'repositoryId' });

  Issue.belongsTo(User);
  Issue.belongsTo(Repository);
  IssueComment.belongsTo(User);
  IssueComment.belongsTo(Issue);
  // Repository.hasOne(DefaultBranch);
  Repository.hasMany(Star);

  Star.belongsTo(Repository);
  Star.belongsTo(User);

  Permission.hasMany(Collaborator, { foreignKey: 'permissionId' });
  Collaborator.belongsTo(User);
  Collaborator.belongsTo(Repository);
  Collaborator.belongsTo(Permission);
};

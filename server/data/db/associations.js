module.exports = (models) => {
  const {
    User, SshKey, Repository, Branch, Commit, CommitComment, OrgUser, Role, Issue, IssueComment, Star, Language, LanguageStats
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Commit);
  User.hasMany(Issue);
  User.hasMany(IssueComment);
  Repository.hasMany(Issue, { foreignKey: 'repositoryId' });
  Issue.hasMany(IssueComment);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });
  User.hasMany(Star);

  OrgUser.belongsTo(User, { foreignKey: 'orgId' });
  OrgUser.belongsTo(Role, { foreignKey: 'roleId' });

  Repository.belongsTo(Branch, { foreignKey: 'defaultBranchId', as: 'defaultBranch' }); // 'defaultBranchId' will be added to Repository
  Repository.hasMany(Branch);
  Branch.belongsTo(Repository);
  Branch.belongsTo(Commit, { foreignKey: 'headCommitId', as: 'headCommit' }); // 'headCommitId' will be added to Branch
  Branch.hasMany(LanguageStats);
  Repository.hasMany(Commit, { foreignKey: 'repositoryId' });
  Commit.hasMany(CommitComment, { foreignKey: 'commitId' });
  Commit.belongsTo(User);
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
  Issue.belongsTo(User);
  Issue.belongsTo(Repository);
  IssueComment.belongsTo(User);
  IssueComment.belongsTo(Issue);
  Repository.hasMany(Star);

  Star.belongsTo(Repository);
  Star.belongsTo(User);

  Language.hasMany(LanguageStats);

  LanguageStats.belongsTo(Language);
  LanguageStats.belongsTo(Branch);
};

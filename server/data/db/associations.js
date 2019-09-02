module.exports = (models) => {
  const {
    User,
    SshKey,
    Repository,
    Branch,
    Commit,
    CommitComment,
    OrgUser,
    Role,
    Issue,
    IssueComment,
    Star,
    Label,
    Language,
    LanguageStats,
    PullRequest,
    PRStatus,
    Permission,
    Collaborator
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Commit);
  User.hasMany(Issue);
  User.hasMany(IssueComment);
  User.hasMany(PullRequest);
  Repository.hasMany(Issue, { foreignKey: 'repositoryId' });
  Repository.hasMany(PullRequest, { foreignKey: 'repositoryId' });
  Issue.hasMany(IssueComment, { onDelete: 'cascade' });

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });
  User.hasMany(Star);
  User.hasMany(Collaborator, { foreignKey: 'userId' });

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
  Commit.belongsTo(Repository);

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
  Repository.hasMany(Star);
  PullRequest.belongsTo(User);
  PullRequest.belongsTo(Repository);
  PullRequest.belongsTo(PullRequest, { foreignKey: 'parentId' });
  PullRequest.belongsTo(PRStatus, { foreignKey: 'statusId' });
  PullRequest.belongsTo(Commit, { foreignKey: 'toCommitId' });
  PullRequest.belongsTo(Commit, { foreignKey: 'fromCommitId' });
  PullRequest.belongsTo(Branch, { foreignKey: 'fromBranchId' });
  PullRequest.belongsTo(Branch, { foreignKey: 'toBranchId' });
  Star.belongsTo(Repository);
  Star.belongsTo(User);

  Permission.hasMany(Collaborator, { foreignKey: 'permissionId' });
  Collaborator.belongsTo(User);
  Collaborator.belongsTo(Repository);
  Collaborator.belongsTo(Permission);

  Language.hasMany(LanguageStats);

  LanguageStats.belongsTo(Language);
  LanguageStats.belongsTo(Branch);

  Repository.hasMany(Label);
  Label.belongsTo(Repository);
};

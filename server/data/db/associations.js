module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit, CommitComment
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);

  Repository.belongsTo(User);

  Repository.hasMany(Commit);

  Commit.belongsTo(Repository);

  Commit.hasMany(CommitComment);
  CommitComment.belongsTo(Commit);

  Repository.hasMany(CommitComment);
  CommitComment.belongsTo(Repository);

  // Repository.hasOne(DefaultBranch);
};

module.exports = (models) => {
  const {
    User, SshKey, Repository, Commits
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);

  Repository.belongsTo(User);

  Repository.hasMany(Commits);

  Commits.belongsTo(Repository);
  // Repository.hasOne(DefaultBranch);
};

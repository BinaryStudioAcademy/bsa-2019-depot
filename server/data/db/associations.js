module.exports = (models) => {
  const {
    User, SshKey, Repository, Commit
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);

  Repository.belongsTo(User);

  Repository.hasMany(Commit);

  Commit.belongsTo(Repository);
  // Repository.hasOne(DefaultBranch);
};

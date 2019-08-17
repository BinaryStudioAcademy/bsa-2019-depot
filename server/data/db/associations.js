module.exports = (models) => {
  const { User, SshKey, Repository, Issue } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Issue);
  Repository.hasMany(Issue);

  Repository.belongsTo(User);
  Issue.belongsTo(User);
  Issue.belongsTo(Repository);
  // Repository.hasOne(DefaultBranch);
};

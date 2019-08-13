module.exports = models => {
  const { User, SshKey, Repository } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);

  Repository.belongsTo(User);
  //Repository.hasOne(DefaultBranch);
};

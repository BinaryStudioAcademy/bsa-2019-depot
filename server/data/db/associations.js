module.exports = models => {
  const { User, SshKey } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
};

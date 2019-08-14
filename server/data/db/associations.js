module.exports = (models) => {
  const { User, SshKey, OrgUser } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
};

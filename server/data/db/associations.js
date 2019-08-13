module.exports = (models) => {
  const { User, SshKey, OrgUser } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
};

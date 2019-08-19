module.exports = (models) => {
  const {
    User, SshKey, Repository, OrgUser, Role, Star
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
  User.hasMany(Repository);
  User.hasMany(Star);

  User.hasMany(OrgUser, { foreignKey: 'userId' });
  User.hasMany(OrgUser, { foreignKey: 'orgId' });
  Role.hasMany(OrgUser, { foreignKey: 'roleId' });

  Repository.belongsTo(User);
  // Repository.hasOne(DefaultBranch);
  Repository.hasMany(Star);

  Star.belongsTo(Repository);
  Star.belongsTo(User);
};

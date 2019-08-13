module.exports = (models) => {
  const { User, SshKey } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);

  User.belongsToMany(User, { through: 'orgUsers' });
  User.belongsToMany(User, { through: 'orgUsers' });
};

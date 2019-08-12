export default (models) => {
  const {
    User,
    SshKey
  } = models;

  SshKey.belongsTo(User);

  User.hasMany(SshKey);
};

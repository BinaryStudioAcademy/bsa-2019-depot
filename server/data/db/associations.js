module.exports = (models) => {
  const {
    User,
    Repository
  } = models;

  User.hasMany(Repository, { foreignKey: 'ownerID' });
  Repository.belongsTo(User, { foreignKey: 'ownerID' });
};

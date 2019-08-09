export default (models) => {
  const {
    User,
    Repository
  } = models;

  User.hasMany(Repository);
  Repository.belongsTo(User);
};

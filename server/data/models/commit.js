module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'commit',
    {
      sha: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return Commit;
};

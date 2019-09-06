module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'commit',
    {
      sha: DataTypes.STRING,
      message: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return Commit;
};

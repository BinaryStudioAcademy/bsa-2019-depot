module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'commit',
    {
      sha: DataTypes.STRING,
      repoId: DataTypes.UUID
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return Commit;
};

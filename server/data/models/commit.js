module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'commit',
    {
      sha: DataTypes.STRING,
      repoId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'repositories',
          key: 'id'
        }
      }
    },
    {}
  );
  return Commit;
};

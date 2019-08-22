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
  // Commit.associate = function (/* models */) {
  //   // associations can be defined here
  // };
  return Commit;
};

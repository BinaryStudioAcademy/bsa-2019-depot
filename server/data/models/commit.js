module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define(
    'commit',
    {
      sha: DataTypes.STRING
    },
    {}
  );
  Commit.associate = function (/* models */) {
    // associations can be defined here
  };
  return Commit;
};

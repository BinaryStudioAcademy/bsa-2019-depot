module.exports = (sequelize, DataTypes) => {
  const Commits = sequelize.define(
    'commits',
    {
      sha: DataTypes.STRING
    },
    {}
  );
  Commits.associate = function (/* models */) {
    // associations can be defined here
  };
  return Commits;
};

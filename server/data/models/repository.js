

module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define(
    'Repository',
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      id: DataTypes.Sequelize.UUID,
      isPublic: DataTypes.BOOLEAN
    },
    {}
  );
  Repository.associate = function (models) {
    // associations can be defined here
  };
  return Repository;
};

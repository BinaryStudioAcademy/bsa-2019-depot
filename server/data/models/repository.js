module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define(
    'repository',
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );

  return Repository;
};

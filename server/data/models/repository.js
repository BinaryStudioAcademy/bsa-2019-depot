module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define(
    'repository',
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      website: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Repository;
};

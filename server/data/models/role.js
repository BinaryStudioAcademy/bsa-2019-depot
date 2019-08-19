module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role',
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );

  return Role;
};

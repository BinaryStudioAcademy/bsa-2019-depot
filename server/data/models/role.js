module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role',
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Role;
};

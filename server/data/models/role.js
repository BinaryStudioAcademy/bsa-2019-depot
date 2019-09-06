module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'role',
    {
      name: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Role;
};

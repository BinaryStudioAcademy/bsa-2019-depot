module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'permission',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Permission;
};

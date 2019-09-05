module.exports = (sequelize, DataTypes) => {
  const PRStatus = sequelize.define(
    'prstatus',
    {
      name: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return PRStatus;
};

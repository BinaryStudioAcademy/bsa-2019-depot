module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    'branch',
    {
      name: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return Branch;
};

module.exports = (sequelize, DataTypes) => {
  const reviewStatus = sequelize.define(
    'reviewStatus',
    {
      name: DataTypes.STRING
    },
    {
      paranoid: true,
      timestamps: true
    }
  );
  return reviewStatus;
};

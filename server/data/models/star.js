module.exports = (sequelize, DataTypes) => {
  const Star = sequelize.define(
    'star',
    {
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Star;
};

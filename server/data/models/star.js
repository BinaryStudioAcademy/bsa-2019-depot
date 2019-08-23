module.exports = (sequelize, DataTypes) => {
  const Star = sequelize.define(
    'star',
    {
      userId: DataTypes.UUID,
      repositoryId: DataTypes.UUID,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Star;
};

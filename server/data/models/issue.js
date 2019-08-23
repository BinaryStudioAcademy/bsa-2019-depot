module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    'issue',
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      isOpened: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      userId: DataTypes.UUID,
      repositoryId: DataTypes.UUID,
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Issue;
};

module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    'issue',
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      isOpened: DataTypes.BOOLEAN
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Issue;
};

module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define(
    'issue',
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      isOpened: DataTypes.BOOLEAN,
      assignees: DataTypes.ARRAY(DataTypes.TEXT),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );

  return Issue;
};

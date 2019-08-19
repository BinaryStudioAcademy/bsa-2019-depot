module.exports = (sequelize, DataTypes) => {
  const OrgUser = sequelize.define(
    'orgUser',
    {
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );

  return OrgUser;
};

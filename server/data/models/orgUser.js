module.exports = (sequelize, DataTypes) => {
  const OrgUser = sequelize.define(
    'orgUser',
    {
      isActivated: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );

  return OrgUser;
};

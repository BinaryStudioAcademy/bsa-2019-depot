module.exports = (sequelize, DataTypes) => {
  const OrgUser = sequelize.define(
    'orgUser',
    {
      isActivated: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return OrgUser;
};

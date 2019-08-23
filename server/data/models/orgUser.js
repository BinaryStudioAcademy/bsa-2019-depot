module.exports = (sequelize, DataTypes) => {
  const OrgUser = sequelize.define(
    'orgUser',
    {
      orgId: DataTypes.UUID,
      userId: DataTypes.UUID,
      roleId: DataTypes.UUID,
      isActivated: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return OrgUser;
};

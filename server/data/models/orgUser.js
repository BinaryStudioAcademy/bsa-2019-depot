module.exports = (sequelize, DataTypes) => {
  const OrgUser = sequelize.define(
    'orgUser',
    {
      isActivated: DataTypes.BOOLEAN
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return OrgUser;
};

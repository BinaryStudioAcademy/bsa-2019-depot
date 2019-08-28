module.exports = sequelize => {
  const Collaborator = sequelize.define(
    'collaborator',
    {
      isActivated: DataTypes.BOOLEAN
    },
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Collaborator;
};

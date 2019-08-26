module.exports = sequelize => {
  const Collaborator = sequelize.define(
    'collaborator',
    {},
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Collaborator;
};

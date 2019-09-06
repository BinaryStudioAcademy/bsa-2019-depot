module.exports = (sequelize) => {
  const Star = sequelize.define(
    'star',
    {},
    {
      paranoid: true,
      timestamps: true
    }
  );

  return Star;
};

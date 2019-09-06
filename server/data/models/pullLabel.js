module.exports = (sequelize) => {
  const pullLabel = sequelize.define(
    'pullLabel',
    {},
    {
      paranoid: true,
      timestamps: true
    }
  );

  return pullLabel;
};

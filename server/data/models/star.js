module.exports = (sequelize) => {
  const Star = sequelize.define('star', {
    timestamps: false
  });

  return Star;
};

module.exports = (sequelize) => {
  const PinnedRepository = sequelize.define('pinnedRepository', {}, {
    timestamps: false
  });

  return PinnedRepository;
};

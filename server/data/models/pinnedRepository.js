module.exports = (sequelize) => {
  const PinnedRepository = sequelize.define('pinnedRepository', {});

  return PinnedRepository;
};

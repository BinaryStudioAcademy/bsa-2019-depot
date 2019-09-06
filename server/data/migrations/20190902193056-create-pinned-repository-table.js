module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('pinnedRepositories', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    userId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    repositoryId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'repositories',
        key: 'id'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('pinnedRepositories')
};

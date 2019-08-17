module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('stars', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    repositoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'repositories',
        key: 'id'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('stars')
};

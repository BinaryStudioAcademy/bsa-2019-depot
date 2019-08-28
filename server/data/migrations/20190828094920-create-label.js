module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('labels', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    color: {
      type: Sequelize.STRING
    },
    repositoryId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE
  }),
  down: queryInterface => queryInterface.dropTable('labels')
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('issues', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.TEXT
    },
    body: {
      type: Sequelize.TEXT
    },
    isOpened: {
      type: Sequelize.BOOLEAN
    },
    assignees: {
      type: Sequelize.ARRAY(Sequelize.TEXT)
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
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('issues')
};

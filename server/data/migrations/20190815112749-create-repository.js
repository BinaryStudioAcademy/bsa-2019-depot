module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('repositories', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    /*      defaultBranchId: {
        type: Sequelize.UUID,
        references: {
          model: 'branches',
          key: 'repoID'
        }
      }, */
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('repositories')
};

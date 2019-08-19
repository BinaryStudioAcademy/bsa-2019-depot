module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.createTable('orgUsers', {
      orgId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roles',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.dropTable('orgUsers', { transaction })]))
};

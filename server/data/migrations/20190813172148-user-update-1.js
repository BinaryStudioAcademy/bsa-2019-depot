module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('users', 'type', {
      allowNull: false,
      type: Sequelize.TEXT,
      unique: false,
      defaultValue: 'USER'
    }),
    queryInterface.addColumn('users', 'fake', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      unique: false,
      defaultValue: false
    }),
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
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeColumn('users', 'type', { transaction }),
    queryInterface.removeColumn('users', 'fake', { transaction }),
    queryInterface.dropTable('orgUsers', { transaction })
  ]))
};

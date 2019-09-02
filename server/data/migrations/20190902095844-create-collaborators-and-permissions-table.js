module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'permissions',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true
        },
        description: {
          type: Sequelize.STRING
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'collaborators',
      {
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
        },
        permissionId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'permissions',
            key: 'id'
          }
        },
        isActivated: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ]))),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('permissions', { transaction }),
    queryInterface.dropTable('collaborators', { transaction })
  ]))
};

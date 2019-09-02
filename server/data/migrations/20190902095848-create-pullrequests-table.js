module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'prstatuses',
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
          type: Sequelize.TEXT
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'pullrequests',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        title: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        body: {
          type: Sequelize.TEXT
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
        fromBranchId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        toBranchId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        fromCommitId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        toCommitId: {
          allowNull: false,
          type: Sequelize.UUID
        },
        parentId: {
          type: Sequelize.UUID
        },
        statusId: {
          type: Sequelize.UUID,
          references: {
            model: 'prstatuses',
            key: 'id'
          }
        },
        number: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ]))),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('pullrequests', { transaction }),
    queryInterface.dropTable('prstatuses', { transaction })
  ]))
};

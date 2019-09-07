module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'reviewStatuses',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'pullReviewers',
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
        pullId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'pullrequests',
            key: 'id'
          }
        },
        statusId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'reviewStatuses',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('reviewStatuses', { transaction }),
    queryInterface.dropTable('pullReviewers', { transaction })
  ]))
};

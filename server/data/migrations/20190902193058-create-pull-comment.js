module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'pullComments',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        body: {
          allowNull: false,
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
        pullId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'pullrequests',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.dropTable('pullComments', { transaction })]))
};

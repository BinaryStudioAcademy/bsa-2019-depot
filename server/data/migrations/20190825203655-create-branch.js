module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'branches',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        headCommitId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'commits',
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
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('branches', { transaction })
  ]))
};

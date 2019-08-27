module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'repositories',
      'defaultBranchId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'branches',
          key: 'id'
        }
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('repositories', 'defaultBranchId', { transaction })]))
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'users',
      'status',
      {
        type: Sequelize.STRING
      },
      { transaction }
    )
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('users', 'status', { transaction })]))
};

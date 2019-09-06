module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'issues',
      'number',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      { transaction }
    )
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('issues', 'number', { transaction })]))
};

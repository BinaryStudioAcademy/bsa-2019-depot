module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'users',
      'deviceToken',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      { transaction }
    )
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('users', 'deviceToken', { transaction })]))
};

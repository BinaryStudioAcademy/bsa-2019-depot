module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'repositories',
      'isPublic',
      {
        allowNull: false,
        type: Sequelize.TEXT
      },
      { transaction }
    )
  ])),

  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('repositories', 'isPublic', { transaction })]))
};

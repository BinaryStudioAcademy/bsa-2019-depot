module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('orgUsers', 'isActivated', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      unique: false
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('orgUsers', 'isActivated', { transaction })]))
};

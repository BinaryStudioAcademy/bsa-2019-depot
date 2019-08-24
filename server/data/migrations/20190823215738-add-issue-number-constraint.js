module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint('issues', ['number', 'repositoryId'], {
      type: 'unique',
      name: 'unique_number_per_repo'
    }, { transaction })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeConstraint('issues', 'unique_number_per_repo', { transaction })
  ]))
};
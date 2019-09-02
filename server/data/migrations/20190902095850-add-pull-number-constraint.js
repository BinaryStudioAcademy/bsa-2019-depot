module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'pullrequests',
      ['number', 'repositoryId'],
      {
        type: 'unique',
        name: 'unique_pull_number_per_repo'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('pullrequests', 'unique_pull_number_per_repo', { transaction })]))
};

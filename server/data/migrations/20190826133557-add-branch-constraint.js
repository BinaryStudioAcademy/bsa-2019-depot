module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'branches',
      ['name', 'repositoryId', 'deletedAt'],
      {
        type: 'unique',
        name: 'unique_branchname_per_repo'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('branches', 'unique_branchname_per_repo', { transaction })]))
};

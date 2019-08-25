module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'repositories',
      ['name', 'userId'],
      {
        type: 'unique',
        name: 'unique_reponame_per_user'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('repositories', 'unique_reponame_per_user', { transaction })]))
};

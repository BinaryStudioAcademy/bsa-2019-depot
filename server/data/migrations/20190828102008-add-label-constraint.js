module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'labels',
      ['name', 'repositoryId', 'deletedAt'],
      {
        type: 'unique',
        name: 'unique_label_name_per_repo'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('labels', 'unique_label_name_per_repo', { transaction })]))
};

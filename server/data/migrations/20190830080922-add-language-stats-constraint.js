module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'languageStats',
      ['branchId', 'languageId'],
      {
        type: 'unique',
        name: 'unique_language_per_branch'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('languageStats', 'unique_language_per_branch', { transaction })]))
};

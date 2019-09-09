module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'issueLabels',
      ['issueId', 'labelId', 'deletedAt'],
      {
        type: 'unique',
        name: 'unique_label_per_issue'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('issueLabels', 'unique_label_per_issue', { transaction })]))
};

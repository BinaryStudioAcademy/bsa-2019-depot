module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'issueAssignees',
      ['issueId', 'assigneeId', 'deletedAt'],
      {
        type: 'unique',
        name: 'unique_assignee_per_issue'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('issueAssignees', 'unique_assignee_per_issue', { transaction })]))
};

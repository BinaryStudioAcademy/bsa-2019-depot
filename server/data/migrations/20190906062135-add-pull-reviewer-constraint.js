module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint(
      'pullReviewers',
      ['userId', 'pullId'],
      {
        type: 'unique',
        name: 'unique_reviewer_per_pull'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeConstraint('pullReviewers', 'unique_reviewer_per_pull', { transaction })]))
};

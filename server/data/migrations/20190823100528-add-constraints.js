module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addConstraint('repositories', ['name', 'userId'], {
      type: 'unique',
      name: 'unique_reponame_per_user'
    }, { transaction }),
    queryInterface.addConstraint('issues', ['number', 'userId'], {
      type: 'unique',
      name: 'unique_number_per_userId'
    }, { transaction }),

  ]))
};

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('repositories', 'description', {
      allowNull: true,
      type: Sequelize.TEXT,
      unique: false
    }),
    queryInterface.addColumn('repositories', 'website', {
      allowNull: true,
      type: Sequelize.STRING,
      unique: false
    }),
    queryInterface.addConstraint('repositories', ['name', 'userId'], {
      type: 'unique',
      name: 'unique_reponame_per_user'
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeColumn('repositories', 'description', { transaction }),
    queryInterface.removeColumn('repositories', 'website', { transaction })
  ]))
};

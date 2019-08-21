module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('repositories', 'forkedFromRepoId', {
      type: Sequelize.INTEGER
    }),
    queryInterface.addColumn('repositories', 'repositoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'repositories',
        key: 'id'
      }
    })
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('repositories', 'forkedFromRepoId', { transaction })]))
};

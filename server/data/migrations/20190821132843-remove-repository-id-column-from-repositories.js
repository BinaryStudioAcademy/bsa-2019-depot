module.exports = {
  up: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.removeColumn('repositories', 'repositoryId', { transaction })])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.addColumn('repositories', 'repositoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'repositories',
        key: 'id'
      }
    })
  ]))
};

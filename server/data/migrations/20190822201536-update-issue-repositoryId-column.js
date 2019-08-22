module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.removeColumn('issues', 'repositoryId'),
    queryInterface.addColumn('issues', 'repositoryId', {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'repositories',
        key: 'id'
      }
    })
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.removeColumn('issues', 'repositoryId'),
    queryInterface.addColumn('issues', 'repositoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'repositories',
        key: 'id'
      }
    })
  ]))
};

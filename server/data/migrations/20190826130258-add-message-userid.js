module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'commits',
      'message',
      {
        allowNull: false,
        type: Sequelize.STRING
      },
      { transaction }
    ),
    queryInterface.addColumn(
      'commits',
      'userId',
      {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.removeColumn('commits', 'message', { transaction }),
    queryInterface.removeColumn('commits', 'userId', { transaction })
  ]))
};

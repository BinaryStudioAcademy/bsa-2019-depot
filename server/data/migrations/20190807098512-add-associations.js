module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.addColumn(
      'Repositories',
      'ownerID',
      {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize
    .transaction(transaction => Promise.all(
      [queryInterface.removeColumn('Repositories', 'ownerID', { transaction })]
    ))
};

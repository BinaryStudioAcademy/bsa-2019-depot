module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'pullLabels',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        pullId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'pullrequests',
            key: 'id'
          }
        },
        labelId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'labels',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.dropTable('pullLabels', { transaction })]))
};

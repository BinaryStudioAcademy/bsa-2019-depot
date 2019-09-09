module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'languageStats',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        branchId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'branches',
            key: 'id'
          }
        },
        languageId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'languages',
            key: 'id'
          }
        },
        percentage: {
          allowNull: false,
          type: Sequelize.FLOAT
        }
      },
      { transaction }
    )
  ])),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.dropTable('languageStats', { transaction })]))
};

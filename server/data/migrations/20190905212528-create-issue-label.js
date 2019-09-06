module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('issueLabels', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    issueId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'issues',
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
  }),
  down: queryInterface => queryInterface.dropTable('issueLabels')
};

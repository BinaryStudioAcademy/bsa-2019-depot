module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('issueAssignees', {
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
    assigneeId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE
  }),
  down: queryInterface => queryInterface.dropTable('issueAssignees')
};

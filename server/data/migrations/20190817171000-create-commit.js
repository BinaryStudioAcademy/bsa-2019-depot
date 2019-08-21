module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('commits', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    sha: {
      type: Sequelize.STRING
    },
    repoId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('commits', { force: true, cascade: true })
};

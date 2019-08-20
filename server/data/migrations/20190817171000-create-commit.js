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
      references: {
        model: 'repositories',
        key: 'id'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('commits')
};

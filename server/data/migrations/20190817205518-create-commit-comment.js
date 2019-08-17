module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('commitComments', {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    body: {
      // allowNull set to default since there could be emoty comments with attached files in future
      type: Sequelize.STRING
    },
    repoId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'repositories',
        key: 'id'
      }
    },
    commitSHA: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
      references: {
        model: 'commits',
        key: 'sha'
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
  down: queryInterface => queryInterface.dropTable('CommitComments')
};
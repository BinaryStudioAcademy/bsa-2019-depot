module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.sequelize.transaction((/* transaction */) => Promise.all([
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  ]))),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([queryInterface.dropTable('users', { transaction, force: true, cascade: true })]))
};

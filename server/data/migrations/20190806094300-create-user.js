export default {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .query('CREATE EXTENSION IF NOT EXISTS pgcrypto;')
    .then(() => queryInterface.sequelize.transaction(transaction => Promise.all([
      queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        username: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING,
          unique: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })]))),
  down: queryInterface => queryInterface.sequelize
    .transaction(transaction => Promise.all([
      queryInterface.dropTable('users', { transaction }),
    ]))
  };


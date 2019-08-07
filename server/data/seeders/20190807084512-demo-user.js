const { usersSeed } = require('../seed-data/users.seed');

module.exports = {
  up: async (queryInterface /* Sequelize */) => {
    await queryInterface.bulkInsert('users', usersSeed);
  },

  down: async (queryInterface /* Sequelize */) => {
    try {
      await queryInterface.bulkDelete('users', null, {});
    } catch (err) {
      // console.log(`Seeding error: ${err}`);
    }
  }
};

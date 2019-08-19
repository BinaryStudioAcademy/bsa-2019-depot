const repositoriesSeed = require('../seed-data/repositories.seed');

const randomIndex = length => Math.floor(Math.random() * length);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const options = {
        type: Sequelize.QueryTypes.SELECT
      };

      const usersQuery = 'SELECT id FROM "users"';
      const users = await queryInterface.sequelize.query(usersQuery, options);

      const repositoriesMappedSeed = repositoriesSeed.map(repository => ({
        ...repository,
        userId: users[randomIndex(users.length)].id
      }));

      await queryInterface.bulkInsert('repositories', repositoriesMappedSeed, {});
    } catch (error) {
      console.error(`Seeding error: ${error}`);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('repositories', null, {});
    } catch (error) {
      console.error(`Seeding error: ${error}`);
    }
  }
};

const starsSeed = require('../seed-data/stars.seed');

const randomIndex = length => Math.floor(Math.random() * length);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const options = {
        type: Sequelize.QueryTypes.SELECT
      };

      const usersQuery = 'SELECT id FROM "users"';
      const users = await queryInterface.sequelize.query(usersQuery, options);

      const repositoriesQuery = 'SELECT id FROM "repositories"';
      const repositories = await queryInterface.sequelize.query(repositoriesQuery, options);

      const starsMappedSeed = starsSeed.map(() => ({
        userId: users[randomIndex(users.length)].id,
        repositoryId: repositories[randomIndex(repositories.length)].id
      }));

      await queryInterface.bulkInsert('stars', starsMappedSeed, {});
    } catch (error) {
      console.error(`Seeding error: ${error}`);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.bulkDelete('stars', null, {});
    } catch (error) {
      console.error(`Seeding error: ${error}`);
    }
  }
};

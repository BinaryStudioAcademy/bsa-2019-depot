const usersSeed = require('../seed-data/users.seed');
const reposSeed = require('../seed-data/repositories.seed');

const randomIndex = length => Math.floor(Math.random() * length);
const createUrl = (user, post) => `http://localhost:3001/${user.username}/${post.name}/settings`;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const options = {
        type: Sequelize.QueryTypes.SELECT
      };
      await queryInterface.bulkInsert('users', usersSeed, {});
      const users = await queryInterface.sequelize.query('SELECT * FROM "users";', options);
      const reposMappedSeed = reposSeed.map((post) => {
        const id = randomIndex(users.length);
        return {
          ...post,
          ownerID: users[id].id,
          url: createUrl(users[id], post)
        };
      });
      await queryInterface.bulkInsert('Repositories', reposMappedSeed, {});
    } catch (err) {
      console.error(`Seeding error: ${err}`);
    }
  },

  down: async (queryInterface /* Sequelize */) => {
    try {
      await queryInterface.bulkDelete('users', null, {});
      await queryInterface.bulkDelete('Repositories', null, {});
    } catch (err) {
      console.error(`Seeding error: ${err}`);
    }
  }
};
